
import { MetadataRoute } from "next";
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await readSiteSettings();
  const allowIndexing = settings?.seo?.allowIndexing ?? true;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/", disallow: "/dadmin/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
