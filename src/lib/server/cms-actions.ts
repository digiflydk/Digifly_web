// DGF-422, DGF-423: Ensure this module can be imported in non-Next environments (Playwright acceptance tests)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('server-only');
} catch {
  // In test/Playwright environments, 'server-only' is not available.
  // Ignore the error so tests can import this file without breaking.
}

import { getDb } from "@/lib/firebase/admin";
import { NavigationSchema, HomepageSchema, type Navigation, type HomePage } from "@/data/schemas";
import { CMS_PATHS } from "../constants";
import { sanitizeHomepage } from "../cms-sanitize";
import deepmerge from "deepmerge";
import { defaultHomepage } from "../defaults/siteDefaults";
import { logAdminAction } from '../dadmin/audit';

// DGF-423: Helper to dynamically revalidate paths only when in a Next.js environment
async function revalidate(path: string, type?: 'layout' | 'page') {
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath(path, type);
  } catch (e) {
    // This will fail in non-Next.js environments like tests, which is expected.
    // We can safely ignore it.
  }
}

export async function saveHomepageAction(payload: unknown) {
    const db = await getDb();
    const sanitized = sanitizeHomepage(payload);
    const merged = deepmerge(defaultHomepage, sanitized);
    const parsed = HomepageSchema.parse(merged);
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
    await revalidate("/", "layout");
    return { ok: true };
}

export async function saveNavigationAction(payload: unknown) {
    const db = await getDb();
    const parsed = NavigationSchema.parse(payload);
    await db.doc('site/navigation').set(parsed, { merge: true });
    
    await logAdminAction({
        action: 'navigation.save',
        status: 'ok',
        path: 'site/navigation',
        receivedPayload: payload,
        afterSaveSnapshot: parsed,
    });

    await revalidate("/", "layout");
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
    const data = snap.exists ? snap.data() as Navigation : null;
    
    await logAdminAction({
        action: 'navigation.read',
        status: 'ok',
        path: 'site/navigation',
        responsePayload: data,
    });
    
    return data;
}
