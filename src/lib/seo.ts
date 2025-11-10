
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-server";
import type { SiteSettings } from "./schemas";
import { getSiteSeo } from "./dadmin/siteSeoRepo";

// Extremely tolerant input shapes to avoid runtime crashes
type UnknownDict = Record<string, unknown>;

type SeoInput = {
  title?: string;
  description?: string;
  images?: string | string[];
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
const FALLBACK_DESC = '';
const FALLBACK_IMAGE = '/og-default.png';

export async function buildSeo(input: SeoInput = {}): Promise<Metadata> {
  const s = await getSiteSeo();

  const title = pickFirst(
    input.title,
    s.general?.title,
    FALLBACK_TITLE
  ) ?? FALLBACK_TITLE;

  const description = pickFirst(
    input.description,
    s.seo?.defaultDescription,
    FALLBACK_DESC
  ) ?? FALLBACK_DESC;

  const imageInput = Array.isArray(input.images) ? input.images[0] : input.images;
  const image = pickFirst(
    imageInput,
    s.seo?.ogImage,
    s.general?.logoUrl,
    FALLBACK_IMAGE
  ) ?? FALLBACK_IMAGE;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const titleTemplate = `%s | ${s.general?.title || FALLBACK_TITLE}`;

  const finalTitle = titleTemplate.includes('%s') ? titleTemplate.replace('%s', title) : title;
  
  const allowIndexing = s.seo?.allowIndexing ?? true;
  const robots = {
    index: input.noIndex ? false : allowIndexing,
    follow: input.noIndex ? false : allowIndexing,
  };

  const canonicalUrl = input.canonical ? new URL(input.canonical, siteUrl) : undefined;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: s.general?.title || FALLBACK_TITLE,
      template: titleTemplate,
      absolute: finalTitle,
    },
    description: description,
    openGraph: {
      title: finalTitle,
      description: description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: description,
      images: image ? [image] : [],
    },
    robots,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  };
}

// Wrapper for page-level generateMetadata functions
export async function buildPageMetadata(page: Partial<Metadata>): Promise<Metadata> {
  try {
    const imageUrls = (page.openGraph as any)?.images?.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);

    return buildSeo({
      title: page.title as string,
      description: page.description as string,
      images: imageUrls,
      noIndex: (page.robots as any)?.noindex,
      canonical: (page.alternates as any)?.canonical,
    });
  } catch (e) {
    console.warn(`[buildPageMetadata] Failed to fetch settings, using safe defaults.`, e);
    return buildSeo({
        title: page.title as string,
        description: page.description as string,
    });
  }
}
