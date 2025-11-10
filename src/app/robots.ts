
import { MetadataRoute } from "next";
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digifly.dk";
  const settings = await readSiteSettings();
  const allowIndexing = settings?.seo?.allowIndexing ?? true;

  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
