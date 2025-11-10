
import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms-server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digifly.dk";
  const settings = await getSiteSettings();
  const allowIndexing = settings?.seo?.allowIndexing ?? true;

  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
