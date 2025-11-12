
"use server";
export const runtime = "nodejs";
import { saveNavigationAction as saveAction } from "@/lib/server/cms-actions";
import type { Navigation } from "@/lib/schemas";

export async function saveNavigationAction(payload: Navigation) {
  return await saveAction(payload);
}
