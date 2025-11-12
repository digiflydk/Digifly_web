
"use server";
import { saveHomepageAction as saveAction } from "@/lib/server/cms-actions";

export async function saveHomepageAction(payload: unknown) {
    return await saveAction('default', payload);
}
