
import { Metadata } from "next";
import { getSiteSettings } from "./cms-server";

export async function buildSiteMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: s.siteTitle,
      template: `%s | ${s.siteTitle}`,
    },
    description: s.defaultSeo.description || s.social.tagline,
    openGraph: {
      title: s.siteTitle,
      description: s.defaultSeo.description || s.social.tagline,
      url: baseUrl,
      siteName: s.siteTitle,
      images: ['/og-default.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.siteTitle,
      description: s.defaultSeo.description || s.social.tagline,
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: baseUrl,
    },
    icons: { icon: [{ url: s.brand.favicon.src }] },
    manifest: '/manifest.webmanifest',
  };
}


export async function metaDefaults({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}): Promise<Metadata> {
  const baseMeta = await buildSiteMetadata();
  const pageTitle = title ?? baseMeta.title?.default as string;
  const pageDesc = description ?? baseMeta.description as string;
  
  return {
    ...baseMeta,
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      ...baseMeta.openGraph,
      title: pageTitle,
      description: pageDesc,
      images: image ? [image] : baseMeta.openGraph?.images,
    },
    twitter: {
        ...baseMeta.twitter,
        title: pageTitle,
        description: pageDesc,
        images: image ? [image] : baseMeta.twitter?.images,
    }
  };
}
