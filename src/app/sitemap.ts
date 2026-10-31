import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/marketing";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base || process.env.SITE_INDEXABLE !== "true") return [];
  return [
    "/",
    "/services",
    "/cases",
    "/cases/orderfly",
    "/cases/opsfly",
    "/about",
    "/contact",
    "/privacy",
    "/cookies",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
