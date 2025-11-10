
import { MetadataRoute } from "next";
import { listCaseSlugs } from "@/lib/cms-server";
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";

// Static pages that should always be in the sitemap
const STATIC_PAGES = ["/", "/about", "/services", "/cases", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await readSiteSettings();
  const base = settings?.seo?.canonicalBase || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const caseSlugs = await listCaseSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(p => ({
    url: `${base}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.8,
  }));

  const caseEntries: MetadataRoute.Sitemap = caseSlugs.map(slug => ({
      url: `${base}/cases/${slug}`,
      changeFrequency: 'monthly',
      priority: 0.6
  }));

  return [...staticEntries, ...caseEntries];
}
