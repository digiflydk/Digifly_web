
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type HomePage } from "@/lib/schemas";
import { saveHomepageServer as saveHomepageServerAction } from "@/lib/server/cms-actions";

// This file is kept for separation of concerns, but the main logic is now
// in the API route, and this action calls the underlying server function.
// The form could also call the API route directly via fetch.

export async function saveHomepageAction(data: HomePage) {
  try {
    const result = await saveHomepageServerAction(data);
    revalidatePath("/", "layout");
    revalidatePath("/dadmin/homepage");
    return result;
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      console.error("Zod validation failed:", e.issues);
      return { ok: false, error: "Validation failed", issues: e.issues };
    }
    console.error("[saveHomepageAction] Error:", e);
    return { ok: false, error: e?.message ?? "Failed to save homepage" };
  }
}
