
"use server";

import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/schemas";
import { readSiteSettings, writeSiteSettings } from "@/lib/dadmin/siteSeoRepo";

/**
 * Server Action: fetch settings
 * Only used from Client/Server Components via direct call – not imported in pages for SSR.
 */
export async function getSiteSettingsAction(): Promise<SiteSettings | null> {
  return await readSiteSettings();
}

/**
 * Server Action: save settings
 */
export async function saveSiteSettingsAction(
  input: SiteSettings
): Promise<{ ok: true }> {
  await writeSiteSettings(input);
  // revalidate frontend + admin
  revalidatePath("/", "layout");
  revalidatePath("/dadmin/site-seo");
  return { ok: true };
}
