
"use server";
import { saveHomepage as saveAction } from "@/lib/cms-server";

export async function saveHomepageAction(payload: unknown) {
    return await saveAction(payload);
}
