

import type { Metadata } from "next";
import type { SiteSettings } from "./schemas";
import { readSiteSettings } from "./dadmin/siteSeoRepo";

// Extremely tolerant input shapes to avoid runtime crashes
type SeoInput = {
  title?: string | null;
  description?: string | null;
  images?: string | string[] | null;
  noIndex?: boolean;
  canonical?: string;
};

// Helper: first non-empty string
function pickFirst(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v;
  }
  return undefined;
}

const FALLBACK_TITLE = 'Digifly';
const FALLBACK_DESC = 'Digital strategi, automation & software udvikling.';
const FALLBACK_IMAGE = '/og-default.png';

export async function buildSeo(input: SeoInput = {}, overrideSettings?: SiteSettings | null): Promise<Metadata> {
  const s = overrideSettings ?? await readSiteSettings();

  // Use nullish coalescing for safe fallbacks
  const title = pickFirst(input.title, s?.seo?.defaultTitle, s?.general?.brandName, FALLBACK_TITLE) ?? FALLBACK_TITLE;
  const description = pickFirst(input.description, s?.seo?.defaultDescription, FALLBACK_DESC) ?? FALLBACK_DESC;

  // Handle various image input formats
  const imageInput = Array.isArray(input.images) ? input.images[0] : input.images;
  const image = pickFirst(imageInput, s?.seo?.ogImage, s?.general?.logoUrl, FALLBACK_IMAGE) ?? FALLBACK_IMAGE;

  const siteUrl = s?.seo?.canonicalBase || process.env.NEXT_PUBLIC_SITE_URL || '';
  const siteName = s?.general?.brandName || FALLBACK_TITLE;
  
  const allowIndexing = s?.seo?.allowIndexing ?? true;
  const robots = {
    index: input.noIndex ? false : allowIndexing,
    follow: input.noIndex ? false : allowIndexing,
  };

  const canonicalUrl = input.canonical ? new URL(input.canonical, siteUrl) : undefined;
  
  const finalTitle = s?.seo?.defaultTitle ? s.seo.defaultTitle.replace('%s', title) : title;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
      absolute: finalTitle
    },
    description,
    openGraph: {
      title: finalTitle,
      description,
      images: image ? [{ url: image }] : [],
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description,
      images: image ? [image] : [],
    },
    robots,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    icons: {
        icon: s?.general?.faviconUrl || '/favicon.ico'
    }
  };
}

// Wrapper for page-level generateMetadata functions
export async function buildPageMetadata(page: Partial<Metadata>): Promise<Metadata> {
  const imageUrls = (page.openGraph as any)?.images?.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);

  return buildSeo({
    title: page.title as string,
    description: page.description as string,
    images: imageUrls,
    noIndex: (page.robots as any)?.noindex,
    canonical: (page.alternates as any)?.canonical,
  });
}
