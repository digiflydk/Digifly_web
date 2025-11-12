
"use server";
import 'server-only';
import { getDb as getAdminDb } from "@/lib/firebase-admin";
import { NavigationSchema, HomepageSchema, type Navigation } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "../constants";

export async function getNavigation(): Promise<Navigation> {
    const db = await getAdminDb();
    const snap = await db.doc(CMS_PATHS.navigation).get();
    if (!snap.exists) {
        // Return a default structure if the doc doesn't exist
        return { header: [], footer: { columns: [] } };
    }
    const parsed = NavigationSchema.parse(snap.data());
    return parsed;
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
  // Assuming normalizeHome is defined elsewhere to handle data migrations/defaults
  // const normalized = normalizeHome(data); 
  return HomepageSchema.parse(data);
}

export async function saveHomepageServer(payload: unknown) {
  const parsed = HomepageSchema.parse(payload);
  const db = await getAdminDb();
  await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
  return { ok: true };
}
