"use server";

import { getDb } from '@/lib/firebase-admin';
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { coerceToDefaults, emptySiteSeo } from '@/components/dadmin/site-seo/utils/formDefaults';

const DOC_PATH = "settings/site-seo";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const snap = await db.doc(DOC_PATH).get();
    
    if (!snap.exists) {
      return coerceToDefaults({});
    }

    const data = snap.data();
    return coerceToDefaults(data);
  } catch (error: any) {
    console.error('[getSiteSettings Action] Failed to fetch settings:', error);
    // On error, return safe defaults to avoid breaking the UI
    return emptySiteSeo;
  }
}

export async function saveSiteSettings(data: SiteSettings): Promise<{ ok: boolean; error?: string }> {
  try {
    const parsed = SiteSettingsSchema.parse(data);
    const db = await getDb();
    await db.doc(DOC_PATH).set(parsed, { merge: true });
    
    // Revalidate paths that use this data
    revalidatePath('/', 'layout');

    return { ok: true };
  } catch (error: any) {
    console.error("[saveSiteSettings Action] Error:", error);
    return { ok: false, error: error.message || "An unknown error occurred." };
  }
}
