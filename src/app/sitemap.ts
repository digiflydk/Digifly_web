import type { MetadataRoute } from 'next';
import { getCases } from '@/lib/cms';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  try {
    const cases = await getCases();
    if (cases && cases.length > 0) {
      const mapped = cases
        .filter(c => c?.slug)
        .map(c => ({
          url: `${base}/cases/${c.slug}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6
        } as MetadataRoute.Sitemap[0]));
      return [...staticEntries, ...mapped];
    }
  } catch (e) {
      console.warn("Could not fetch cases for sitemap, returning static only.", e);
  }

  return staticEntries;
}
