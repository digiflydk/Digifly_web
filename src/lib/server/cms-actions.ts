
"use server";
import 'server-only';
import { getDb } from "@/lib/firebase-admin";
import { NavigationSchema, type Navigation } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "../constants";
import { defaultNavigation } from "../defaults/siteDefaults";

export async function getNavigation(): Promise<Navigation | null> {
    const db = await getDb();
    // DGF-330 Use new path from constants
    const snap = await db.doc(CMS_PATHS.navigation).get();
    if (!snap.exists) return defaultNavigation;

    const parsed = NavigationSchema.safeParse(snap.data());
    if (parsed.success) {
        return parsed.data;
    }
    console.warn("[getNavigation] Zod validation failed. Returning default.", parsed.error);
    return defaultNavigation;
}

export async function updateNavigation(payload: unknown): Promise<{ ok: true }> {
    const parsed = NavigationSchema.parse(payload); // Throws on validation error
    const db = await getDb();
    // DGF-330 Use new path from constants
    await db.doc(CMS_PATHS.navigation).set(parsed, { merge: true });
    revalidatePath("/", "layout");
    revalidatePath("/dadmin/navigation");
    return { ok: true };
}
