'use server';

import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/schemas";
import { readSiteSettings, writeSiteSettings } from "@/lib/dadmin/siteSeoRepo";

export async function getSiteSettings(): Promise<SiteSettings> {
  return await readSiteSettings();
}

export async function saveSiteSettings(input: SiteSettings): Promise<{ ok: true }> {
  await writeSiteSettings(input);
  revalidatePath("/", "layout");
  revalidatePath("/dadmin/site-seo", "page");
  return { ok: true };
}
