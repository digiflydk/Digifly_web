// src/lib/dadmin/siteSeoRepo.ts
import { getDb } from "@/lib/firebase-admin";
import type { SiteSettings } from "@/lib/schemas";
import { coerceToDefaults } from "@/components/dadmin/site-seo/utils/formDefaults";

const COLLECTION = "settings";
const DOC_ID = "site";

export async function readSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const snap = await db.collection(COLLECTION).doc(DOC_ID).get();
  const data = snap.exists ? snap.data() : {};
  // Coerce to ensure no undefined values are passed to the form
  return coerceToDefaults(data);
}

export async function writeSiteSettings(data: SiteSettings): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).doc(DOC_ID).set(data, { merge: true });
}
