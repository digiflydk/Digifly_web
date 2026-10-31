import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/marketing";
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  const indexable = process.env.SITE_INDEXABLE === "true" && Boolean(base);
  return {
    rules: [
      {
        userAgent: "*",
        ...(indexable
          ? { allow: "/", disallow: ["/dadmin", "/api/", "/docs"] }
          : { disallow: "/" }),
      },
    ],
    ...(base && indexable ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
