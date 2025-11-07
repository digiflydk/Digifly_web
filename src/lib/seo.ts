

import { Metadata } from "next";
import { getSiteSettings } from "./cms-server";
import { SITE_DEFAULTS } from "./defaults/siteDefaults";
import { SiteSettings } from "./types";

function ogImageForPage(
  pageImage: string | undefined | null,
  site: SiteSettings
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteOg = site.defaultSeo?.defaultThumbnailUrl;

  const url = pageImage || siteOg || '/og-default.jpg';
  
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  return url;
}


export async function buildSiteMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const ogImageUrl = ogImageForPage(undefined, s);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: s.siteTitle,
      template: `%s | ${s.siteTitle}`,
    },
    description: s.defaultSeo?.description || s.social?.tagline,
    openGraph: {
      title: s.siteTitle,
      description: s.defaultSeo?.description || s.social?.tagline,
      url: baseUrl,
      siteName: s.siteTitle,
      images: [ogImageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.siteTitle,
      description: s.defaultSeo?.description || s.social?.tagline,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: baseUrl,
    },
    icons: { icon: [{ url: s.brand?.favicon?.src || '/favicon.ico' }] },
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
  const siteSettings = await getSiteSettings();
  const pageTitle = title ?? baseMeta.title?.default as string;
  const pageDesc = description ?? baseMeta.description as string;
  const ogImageUrl = ogImageForPage(image, siteSettings);
  
  return {
    ...baseMeta,
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      ...baseMeta.openGraph,
      title: pageTitle,
      description: pageDesc,
      images: [ogImageUrl],
    },
    twitter: {
        ...baseMeta.twitter,
        title: pageTitle,
        description: pageDesc,
        images: [ogImageUrl],
    }
  };
}
