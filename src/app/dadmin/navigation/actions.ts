
"use server";

import { revalidatePath } from "next/cache";
import type { Navigation } from "@/lib/schemas";
import { updateNavigation as updateNavigationServer } from "@/lib/server/cms-actions";

export async function saveNavigationAction(data: Navigation): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateNavigationServer(data);
    revalidatePath("/dadmin/navigation");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err: any) {
    console.error("[saveNavigationAction] Error:", err);
    return { ok: false, error: err.message || "An unknown error occurred." };
  }
}
