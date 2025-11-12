
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { HomePage } from "@/lib/schemas";
import { updateHomepage as saveHomepageServer } from "@/lib/server/cms-actions";


export async function saveHomepageAction(data: HomePage) {
  try {
    const result = await saveHomepageServer(data);
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
