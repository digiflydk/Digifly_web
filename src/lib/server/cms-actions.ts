
"use server";
import 'server-only';
import { getDb } from "@/lib/firebase-admin";
import { NavigationSchema, HomepageSchema, type Navigation } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "../constants";
import { defaultHomepage, defaultNavigation, normalizeHome } from "../defaults/siteDefaults";

export async function getNavigation(): Promise<Navigation> {
    const db = await getDb();
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
    const parsed = NavigationSchema.parse(payload);
    const db = await getDb();
    await db.doc(CMS_PATHS.navigation).set(parsed, { merge: true });
    revalidatePath("/", "layout");
    revalidatePath("/dadmin/navigation");
    return { ok: true };
}

export async function getHomepageServer() {
  const db = await getDb();
  const snap = await db.doc(CMS_PATHS.page('home')).get();
  const data = snap.exists ? snap.data() : {};
  const normalized = normalizeHome(data);
  return HomepageSchema.parse(normalized);
}

export async function saveHomepageServer(payload: unknown) {
  const normalized = normalizeHome(payload);
  const parsed = HomepageSchema.parse(normalized);
  const db = await getDb();
  await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
  return { ok: true };
}
