
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
import { ZodError } from "zod";

const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: deepmerge.Options): any[] => sourceArray;

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

export async function saveHomepageAction(payload: unknown): Promise<{ ok: boolean; error?: string; issues?: any[] }> {
    try {
        const db = await getDb();
        const docRef = db.doc(CMS_PATHS.page('home'));

        const existingSnap = await docRef.get();
        const existingData = existingSnap.exists ? existingSnap.data() : {};
        const sanitizedPayload = sanitizeHomepage(payload);
        
        const mergedData = deepmerge(existingData, sanitizedPayload, {
            arrayMerge: overwriteMerge
        });
        
        const parsed = HomepageSchema.parse(mergedData);
        
        await docRef.set(parsed, { merge: false });
        
        await revalidate("/", "layout");

        await logAdminAction({
            action: 'homepage.save',
            status: 'ok',
            path: CMS_PATHS.page('home'),
            payloadSummary: `Hero: ${parsed.hero.slides[0]?.heading ?? 'N/A'}`,
            receivedPayload: payload,
            afterSaveSnapshot: parsed,
        });
        
        return { ok: true };
    } catch (e: any) {
        if (e instanceof ZodError) {
            console.error("[saveHomepageAction] Zod Validation Error:", e.issues);
            await logAdminAction({
                action: 'homepage.save',
                status: 'error',
                path: CMS_PATHS.page('home'),
                errorMessage: 'Zod validation failed.',
                receivedPayload: payload,
            });
            return { ok: false, error: "Validation failed", issues: e.issues };
        }
        console.error("[saveHomepageAction] Unexpected Error:", e.message);
        await logAdminAction({
            action: 'homepage.save',
            status: 'error',
            path: CMS_PATHS.page('home'),
            errorMessage: e.message,
            receivedPayload: payload,
        });
        return { ok: false, error: "An unexpected server error occurred." };
    }
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
