
"use server";

import { revalidatePath } from "next/cache";
import type { Navigation } from "@/lib/schemas";
import { updateNavigation as saveNavigationServer } from "@/lib/server/cms-actions";
import { z } from "zod";

export async function saveNavigationAction(data: Navigation): Promise<{ ok: boolean; error?: string; issues?: z.ZodIssue[] }> {
  try {
    const result = await saveNavigationServer(data);
    revalidatePath("/dadmin/navigation");
    revalidatePath("/", "layout");
    return result;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: "Validation failed", issues: err.issues };
    }
    console.error("[saveNavigationAction] Error:", err);
    return { ok: false, error: err.message || "An unknown error occurred." };
  }
}
