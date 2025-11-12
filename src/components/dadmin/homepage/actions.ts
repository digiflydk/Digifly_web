
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/firebase-admin";
import { HomepageSchema, type HomePage } from "@/lib/schemas";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";
import { zodErrorToIssues } from "@/lib/zod-helpers";
import deepmerge from 'deepmerge';

type GetHomepageResult =
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; error: string; data: HomePage; issues: z.ZodIssue[] };

export async function getHomepage(options: { debug?: boolean } = {}): Promise<GetHomepageResult> {
  try {
    const db = await getDb();
    const snap = await db.doc("pages/home").get();
    
    const data = snap.exists ? snap.data() : {};
    // Merge defaults first, then parse
    const merged = deepmerge(defaultHomepage, data ?? {});
    const parsed = HomepageSchema.safeParse(merged);

    if (parsed.success) {
      return { ok: true, data: parsed.data };
    }

    const issues = zodErrorToIssues(parsed.error);
    if (process.env.NODE_ENV !== "production" || options.debug) {
      console.warn("[getHomepage] Zod validation failed. Returning sanitized fallback.", {
        issues,
      });
    }

    // Return the sanitized data even if validation fails
    const safeFallback = HomepageSchema.parse(merged);

    return {
      ok: false,
      error: "Validation failed, returning best-effort data.",
      data: safeFallback,
      issues,
    };
  } catch (err: any) {
    console.error("[getHomepage] Firestore fetch failed:", err.message);
    return {
      ok: false,
      error: err.message || "Failed to fetch from Firestore.",
      data: defaultHomepage,
      issues: [],
    };
  }
}

export async function saveHomepage(data: HomePage) {
  try {
    const db = await getDb();
    const merged = deepmerge(defaultHomepage, (data as object) ?? {});
    const parsed = HomepageSchema.parse(merged);
    await db.doc("pages/home").set(parsed, { merge: true });
    revalidatePath("/", "layout"); // Revalidate homepage and potentially layouts using this data
    return { ok: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: "Validation failed", issues: error.issues };
    }
    console.error("[saveHomepage] Error:", error);
    return { ok: false, error: (error as Error).message || "An unknown error occurred." };
  }
}
