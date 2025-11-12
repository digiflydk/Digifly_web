
"use server";

import { getDb } from "@/lib/firebase-admin";
import { NavigationSchema, type Navigation } from "@/lib/schemas";
import { CMS_PATHS } from "../constants";
import { revalidatePath } from "next/cache";

export async function getNavigation(): Promise<Navigation | null> {
    const db = await getDb();
    const snap = await db.doc(CMS_PATHS.navigation).get();
    if (!snap.exists) return null;
    return NavigationSchema.parse(snap.data()) as Navigation;
}

export async function updateNavigation(payload: unknown): Promise<{ ok: true }> {
    const parsed = NavigationSchema.parse(payload);
    const db = await getDb();
    await db.doc(CMS_PATHS.navigation).set(parsed, { merge: false });
    revalidatePath("/"); // Revalidate layout
    revalidatePath("/dadmin/navigation"); // Revalidate admin page
    return { ok: true };
}
