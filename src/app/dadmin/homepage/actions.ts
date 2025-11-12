
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { HomepageSchema, type HomePage } from "@/lib/schemas";
import { defaultHomepage, normalizeHome } from "@/lib/defaults/siteDefaults";
import { zodErrorToIssues } from "@/lib/zod-helpers";
import { saveHomepageServer as saveHomepageServerAction } from "@/lib/server/cms-actions";

type GetHomepageResult =
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; error: string; data: HomePage; issues: z.ZodIssue[] };

// getHomepage remains the same as it uses the server-side cms-server which is fine
import { getHomepage } from "@/lib/cms-server";
export { getHomepage };


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
