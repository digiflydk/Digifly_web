"use server";

import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/schemas";
import { writeSiteSettings } from "@/lib/dadmin/siteSeoRepo";

/**
 * Server Action: save settings
 */
export async function saveSiteSettingsAction(
  input: SiteSettings
): Promise<{ ok: true }> {
  await writeSiteSettings(input);
  // revalidate frontend + admin
  revalidatePath("/", "layout");
  revalidatePath("/dadmin/site-seo", "page");
  return { ok: true };
}
