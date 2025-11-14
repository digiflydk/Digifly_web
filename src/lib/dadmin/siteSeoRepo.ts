
import "server-only";
import { getDb } from "@/lib/firebase-admin";
import type { SiteSettings } from "@/lib/schemas";
import { coerceToDefaults } from "@/components/dadmin/site-seo/utils/formDefaults";
import { logAdminAction } from "./audit";

const COLLECTION = "site";
const DOC_ID = "settings";

export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const snap = await db.collection(COLLECTION).doc(DOC_ID).get();
    const data = snap.exists ? snap.data() : {};
    const coercedData = coerceToDefaults(data);
    
    await logAdminAction({
      action: "site-seo.read",
      status: "ok",
      path: `site/settings`,
      firestoreSnapshot: data,
      responsePayload: coercedData
    });

    return coercedData;
  } catch (e: any) {
    console.error('[readSiteSettings] Failed to fetch settings:', e.message);
    // On error, return safe defaults to prevent site crashes
    return coerceToDefaults({});
  }
}

export async function writeSiteSettings(data: SiteSettings): Promise<SiteSettings> {
  const db = await getDb();
  // Ensure we save a complete object to avoid undefined fields
  const safeData = coerceToDefaults(data);
  await db.collection(COLLECTION).doc(DOC_ID).set(safeData, { merge: true });
  return safeData;
}
