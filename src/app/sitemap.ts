
import { MetadataRoute } from "next";
import { getCases } from "@/lib/cms-server";

// Placeholder for a function that would list all published static-like pages
async function listPublicPages(): Promise<string[]> {
    // In a real app, this might fetch slugs from a 'pages' collection
    return ["/", "/about", "/services", "/contact", "/cases"];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digifly.dk";
  const staticPages = await listPublicPages();
  const cases = await getCases();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(p => ({
    url: `${base}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  const caseEntries: MetadataRoute.Sitemap = cases
    .filter(c => c.published && c.slug)
    .map(c => ({
        url: `${base}/cases/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
    }));

  return [...staticEntries, ...caseEntries];
}
