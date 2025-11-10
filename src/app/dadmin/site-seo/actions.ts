'use server';

import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

// Re-defining schema here to be self-contained for the server action
const HoursSchema = z.object({
  enabled: z.boolean().default(false),
  from: z.string().default(''),
  to: z.string().default(''),
});

export const SiteSettingsSchema = z.object({
  general: z.object({
    title: z.string().default(''),
    tagline: z.string().default(''),
    logoUrl: z.string().default(''),
    faviconUrl: z.string().default(''),
  }).default({}),
  contact: z.object({
    email: z.string().default(''),
    phone: z.string().default(''),
    company: z.string().default(''),
    street: z.string().default(''),
    zip: z.string().default(''),
    city: z.string().default(''),
    country: z.string().default(''),
  }).default({}),
  hours: z.object({
    sunday: HoursSchema.default({}),
    monday: HoursSchema.default({}),
    tuesday: HoursSchema.default({}),
    wednesday: HoursSchema.default({}),
    thursday: HoursSchema.default({}),
    friday: HoursSchema.default({}),
    saturday: HoursSchema.default({}),
  }).default({}),
  seo: z.object({
    allowIndexing: z.boolean().default(true),
    defaultDescription: z.string().default(''),
    ogImage: z.string().default(''),
  }).default({}),
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;


export const DEFAULTS: SiteSettings = {
  general: { title: '', tagline: '', logoUrl: '', faviconUrl: '' },
  contact: { email: '', phone: '', company: '', street: '', zip: '', city: '', country: '' },
  hours: {
    sunday: { enabled: false, from: '09:00', to: '17:00' },
    monday: { enabled: true, from: '09:00', to: '17:00' },
    tuesday: { enabled: true, from: '09:00', to: '17:00' },
    wednesday:{ enabled: true, from: '09:00', to: '17:00' },
    thursday: { enabled: true, from: '09:00', to: '17:00' },
    friday:   { enabled: true, from: '09:00', to: '17:00' },
    saturday: { enabled: false, from: '09:00', to: '17:00' },
  },
  seo: { allowIndexing: true, defaultDescription: '', ogImage: '' },
};

const DOC_PATH = "settings/site-seo";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const snap = await db.doc(DOC_PATH).get();
    if (!snap.exists) return DEFAULTS;
    
    // Merge with defaults to avoid undefined issues for partially filled docs
    const data = snap.data();
    const merged = {
      ...DEFAULTS,
      ...data,
      general: { ...DEFAULTS.general, ...(data?.general || {}) },
      contact: { ...DEFAULTS.contact, ...(data?.contact || {}) },
      hours: { ...DEFAULTS.hours, ...(data?.hours || {}) },
      seo: { ...DEFAULTS.seo, ...(data?.seo || {}) },
    };
    return SiteSettingsSchema.parse(merged);
  } catch (error) {
    console.error("[getSiteSettings action] Error fetching data:", error);
    return DEFAULTS; // Return safe defaults on error
  }
}

export async function saveSiteSettings(input: unknown) {
  try {
    const db = await getDb();
    const parsed = SiteSettingsSchema.parse(input);
    await db.doc(DOC_PATH).set(parsed, { merge: true });
    
    // Revalidate paths that use this global data
    revalidatePath('/', 'layout');
    revalidatePath('/dadmin/site-seo', 'page');
    
    return { ok: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: "Validation failed", issues: error.issues };
    }
    console.error("[saveSiteSettings action] Error:", error);
    return { ok: false, error: (error as Error).message || "An unknown error occurred." };
  }
}
