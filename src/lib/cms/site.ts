import fs from "fs/promises";
import path from "path";
import { SiteSettings, SiteSettingsSchema } from "@/lib/schemas";

const filePath = path.join(process.cwd(), "content", "site.json");
const siteDefaults: SiteSettings = {
  siteTitle: "Digifly",
  tagline: "Digital solutions.",
  defaultDescription: "Digifly builds measurable digital results.",
  logoUrl: "",
  faviconUrl: "",
};


export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    const parsed = SiteSettingsSchema.safeParse(json);
    if (!parsed.success) {
      console.warn("Site settings from file failed validation, returning defaults.", parsed.error);
      return siteDefaults;
    }
    return {
      ...siteDefaults,
      ...parsed.data
    };
  } catch {
    console.warn("Could not read site.json, returning defaults.");
    return siteDefaults;
  }
}

export async function saveSiteSettings(payload: any) {
  const parsed = SiteSettingsSchema.parse(payload);
  await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), "utf-8");
}
