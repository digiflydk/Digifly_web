"use server";

import { revalidatePath } from "next/cache";
import { saveNavigation } from "@/lib/cms-server";
import type { Navigation } from "@/lib/types";
import { NavigationSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export async function saveNavigationAction(data: Navigation): Promise<{ ok: boolean; error?: string; issues?: any[] }> {
  try {
    const parsedData = NavigationSchema.parse(data);
    await saveNavigation(parsedData);
    revalidatePath("/dadmin/navigation");
    revalidatePath("/", "layout"); // Revalidate public site layout
    return { ok: true };
  } catch (err: any) {
    if (err instanceof ZodError) {
      console.error("[saveNavigationAction] Validation Error:", err.issues);
      return { ok: false, error: "Validation failed", issues: err.issues };
    }
    console.error("[saveNavigationAction] Error:", err);
    return { ok: false, error: err.message || "An unknown error occurred." };
  }
}
