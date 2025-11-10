
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-server";

// Extremely tolerant input shapes to avoid runtime crashes
type UnknownDict = Record<string, unknown>;

type SiteSettings = UnknownDict; // We won't rely on strict typing here
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

export function buildSeo(input: SeoInput = {}, settings?: SiteSettings): Metadata {
  const s = (settings ?? {}) as UnknownDict;

  // Support a variety of potential shapes:
  const general = (s['general'] ?? {}) as UnknownDict;
  const brand = (s['brand'] ?? {}) as UnknownDict;
  const defaultSeo = (s['defaultSeo'] ?? s['seo'] ?? {}) as UnknownDict;

  // Legacy/alternate keys we’ve seen in crashes/logs:
  const siteTitle = s['siteTitle'] || general['title'];
  const defaultDescription = s['defaultDescription'] || defaultSeo['defaultDescription'];

  // From nested defaultSeo
  const dsTitle = defaultSeo['title'];
  const dsDesc = defaultSeo['description'];
  const dsImage = defaultSeo['image'] || defaultSeo['ogImage'] || defaultSeo['ogImageUrl'];
  const dsOgImage = (defaultSeo as any)['ogImage']; // tolerate legacy

  // From brand
  const brandLogo = ((brand['logo'] ?? {}) as UnknownDict)['src'];
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const titleTemplate = pickFirst(defaultSeo['defaultTitleTemplate']) || '%s | Digifly';

  const title = pickFirst(input.title, dsTitle, siteTitle, FALLBACK_TITLE) ?? FALLBACK_TITLE;

  const finalTitle = titleTemplate.includes('%s') ? titleTemplate.replace('%s', title) : title;
  
  const description = pickFirst(input.description, dsDesc, defaultDescription, FALLBACK_DESC) ?? FALLBACK_DESC;
  
  const imageInput = Array.isArray(input.images) ? input.images[0] : input.images;
  const image = pickFirst(imageInput, dsImage, dsOgImage, brandLogo, FALLBACK_IMAGE) ?? FALLBACK_IMAGE;

  const allowIndexing = typeof defaultSeo['allowIndexing'] === 'boolean' ? defaultSeo['allowIndexing'] : true;
  const robots = {
    index: input.noIndex ? false : allowIndexing,
    follow: input.noIndex ? false : allowIndexing,
  };

  const canonicalUrl = input.canonical ? new URL(input.canonical, siteUrl) : undefined;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: siteTitle as string || FALLBACK_TITLE,
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
    const settings = await getSiteSettings();
    const imageUrls = (page.openGraph as any)?.images?.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);

    return buildSeo({
      title: page.title as string,
      description: page.description as string,
      images: imageUrls,
      noIndex: (page.robots as any)?.noindex,
      canonical: (page.alternates as any)?.canonical,
    }, settings || undefined);
  } catch (e) {
    console.warn(`[buildPageMetadata] Failed to fetch settings, using safe defaults.`, e);
    return buildSeo({
        title: page.title as string,
        description: page.description as string,
    });
  }
}
