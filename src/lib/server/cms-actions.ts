
"use server";
import 'server-only';

import { getDb } from "@/lib/firebase/admin";
import { NavigationSchema, HomepageSchema, type Navigation, type HomePage } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "../constants";
import { sanitizeHomepage } from "../cms-sanitize";
import deepmerge from "deepmerge";
import { defaultHomepage, defaultNavigation } from "../defaults/siteDefaults";

export async function saveHomepageAction(payload: unknown) {
    const db = await getDb();
    const sanitized = sanitizeHomepage(payload);
    const merged = deepmerge(defaultHomepage, sanitized);
    const parsed = HomepageSchema.parse(merged);
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
    revalidatePath("/", "layout");
    return { ok: true };
}

export async function saveNavigationAction(payload: unknown) {
    const db = await getDb();
    const parsed = NavigationSchema.parse(payload);
    await db.doc('site/navigation').set(parsed, { merge: true });
    revalidatePath("/", "layout");
    return { ok: true, error: null };
}

// These are read actions also used by server components, can stay here.
export async function getHomepage() {
    const db = await getDb();
    const snap = await db.doc(CMS_PATHS.page('home')).get();
    return snap.exists ? snap.data() : null;
}

export async function getNavigation(): Promise<Navigation | null> {
    const db = await getDb();
    const snap = await db.doc('site/navigation').get();
    return snap.exists ? snap.data() as Navigation : null;
}
