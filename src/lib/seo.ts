
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { getSiteSettings } from "./cms-server";

type Og = { title: string; description?: string; url?: string; images?: string[] };

export async function buildSiteMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: s.siteTitle || 'Digifly',
      template: `%s | ${s.siteTitle || 'Digifly'}`,
    },
    description: s.defaultDescription || s.tagline || 'Digital solutions.',
    openGraph: {
      title: s.siteTitle || 'Digifly',
      description: s.defaultDescription || s.tagline || 'Digital solutions.',
      url: baseUrl,
      siteName: s.siteTitle || 'Digifly',
      images: ['/og-default.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.siteTitle || 'Digifly',
      description: s.defaultDescription || s.tagline || 'Digital solutions.',
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: baseUrl,
    },
    icons: s.faviconUrl ? { icon: [{ url: s.faviconUrl }] } : { icon: '/favicon.ico' },
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
