'use server';

import { getDb } from "@/lib/firebase-admin";
import type { SiteSettings } from "@/lib/schemas";
import { coerceToDefaults } from "@/components/dadmin/site-seo/utils/formDefaults";

const DOC_PATH = "settings/site-seo";

/**
 * Fetches the site SEO settings from Firestore.
 * Merges the fetched data with defaults to ensure a full object is returned.
 */
export async function readSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const snap = await db.doc(DOC_PATH).get();
  
  const data = snap.exists ? snap.data() : {};
  return coerceToDefaults(data);
}

/**
 * Saves the site SEO settings to Firestore.
 * Overwrites the document with the provided data.
 */
export async function writeSiteSettings(data: SiteSettings): Promise<void> {
  const db = await getDb();
  await db.doc(DOC_PATH).set(data, { merge: true });
}
