
"use server";
import 'server-only';
import { getDb as getAdminDb } from "@/lib/firebase-admin";
import { NavigationSchema, HomepageSchema, type Navigation, type HomePage } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "../constants";
import deepmerge from 'deepmerge';
import { defaultHomepage, defaultNavigation } from '../defaults/siteDefaults';
import { sanitizeHomepage } from '../cms-server';

export async function getNavigation(): Promise<Navigation> {
    const db = await getAdminDb();
    const snap = await db.doc(CMS_PATHS.navigation).get();
    const data = snap.exists ? snap.data() : {};
    return NavigationSchema.parse(deepmerge(defaultNavigation, data ?? {}));
}

export async function updateNavigation(payload: unknown): Promise<{ ok: true }> {
    const parsed = NavigationSchema.parse(payload);
    const db = await getAdminDb();
    await db.doc(CMS_PATHS.navigation).set(parsed, { merge: true });
    revalidatePath("/", "layout");
    revalidatePath("/dadmin/navigation");
    return { ok: true };
}

export async function getHomepageServer() {
  const db = await getAdminDb();
  const snap = await db.doc(CMS_PATHS.page('home')).get();
  const data = snap.exists ? snap.data() : {};
  const sanitized = sanitizeHomepage(data);
  return HomepageSchema.parse(sanitized);
}

export async function updateHomepage(payload: unknown) {
  const sanitized = sanitizeHomepage(payload);
  const parsed = HomepageSchema.parse(sanitized);
  const db = await getAdminDb();
  await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
  return { ok: true };
}
