import { MetadataRoute } from 'next';
import { getCases } from '@/lib/cms';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getCases();

  const caseEntries: MetadataRoute.Sitemap = cases.map(caseDoc => ({
    url: `${siteConfig.url}/cases/${caseDoc.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${siteConfig.url}`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/cases`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
    },
    ...caseEntries,
  ];
}
