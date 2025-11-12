
"use server";
export const runtime = "nodejs";
import 'server-only';

import { getDb as getAdminDb } from "@/lib/firebase-admin";
import { NavigationSchema, HomepageSchema, type Navigation, type HomePage } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "../constants";
import deepmerge from 'deepmerge';
import { defaultHomepage, defaultNavigation } from '../defaults/siteDefaults';
import { sanitizeHomepage } from "../cms-sanitize";


export async function saveNavigationAction(payload: Navigation) {
    const db = getAdminDb();
    const parsed = NavigationSchema.parse(payload);
    await db.doc(CMS_PATHS.navigation).set(parsed, { merge: true });
    revalidatePath("/", "layout");
    revalidatePath("/dadmin/navigation");
    return { ok: true };
}


export async function saveHomepageAction(payload: HomePage) {
    const db = getAdminDb();
    const path = CMS_PATHS.page('home');
    
    // Get existing doc to merge with defaults, then with payload
    const snap = await db.doc(path).get();
    const existing = snap.exists() ? snap.data() : {};
    
    const mergedWithDefaults = deepmerge(defaultHomepage, existing);
    const mergedWithPayload = deepmerge(mergedWithDefaults, payload as any);

    const sanitized = sanitizeHomepage(mergedWithPayload);
    const parsed = HomepageSchema.parse(sanitized);

    await db.doc(path).set(parsed, { merge: true });
    revalidatePath("/");
    revalidatePath("/dadmin/homepage");
    return { ok: true, data: parsed };
}
