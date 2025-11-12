
"use server";
export const runtime = "nodejs";
import { saveNavigationAction as saveAction } from "@/lib/server/cms-actions";

export async function saveNavigationAction(payload: unknown) {
  return await saveAction('default', payload);
}
