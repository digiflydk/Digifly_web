
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-server";
import { SITE_DEFAULTS } from "./defaults/siteDefaults";
import type { SiteSettings } from "./schemas";

type SeoInput = {
  title?: string;
  description?: string;
  images?: string | string[];
  noIndex?: boolean;
  canonical?: string;
};

const FALLBACK_TITLE = 'Digifly';
const FALLBACK_DESC = 'Strategy, Software & Automation with AI.';
const FALLBACK_IMAGE = '/og-default.png';

export async function buildSeo(page: SeoInput = {}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings ?? SITE_DEFAULTS;

  const siteTitle = s.general?.title ?? SITE_DEFAULTS.general.title;
  const titleTemplate = s.seo?.defaultTitleTemplate ?? SITE_DEFAULTS.seo.defaultTitleTemplate;
  
  const finalTitle = page.title 
    ? titleTemplate.replace('%s', page.title)
    : siteTitle;
  
  const finalDescription = page.description || s.seo?.defaultDescription || SITE_DEFAULTS.seo.defaultDescription;

  const ogImages = Array.isArray(page.images) ? page.images : (page.images ? [page.images] : []);
  
  // Handle new 'ogImage' and legacy 'defaultThumbnailUrl'
  const siteOgImage = s.seo?.ogImage || (s.defaultSeo as any)?.defaultThumbnailUrl;
  
  const finalOgImage = ogImages.length > 0 ? ogImages[0] : (siteOgImage || FALLBACK_IMAGE);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonicalUrl = page.canonical ? new URL(page.canonical, siteUrl) : undefined;
  
  const robots = {
    index: page.noIndex ? false : (s.seo?.allowIndexing ?? true),
    follow: page.noIndex ? false : (s.seo?.allowIndexing ?? true),
  };

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: siteTitle,
      template: titleTemplate,
      absolute: finalTitle,
    },
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      images: finalOgImage ? [{ url: finalOgImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: finalOgImage ? [finalOgImage] : [],
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots,
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
