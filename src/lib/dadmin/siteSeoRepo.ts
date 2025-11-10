
import { getDb } from "@/lib/firebase-admin";
import type { SiteSettings } from "@/lib/schemas";
import { coerceToDefaults } from "@/components/dadmin/site-seo/utils/formDefaults";

const COLLECTION = "settings";
const DOC_ID = "site";

export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const snap = await db.collection(COLLECTION).doc(DOC_ID).get();
    const data = snap.exists ? snap.data() : {};
    return coerceToDefaults(data);
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
