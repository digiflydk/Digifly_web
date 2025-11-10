
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms-server";
import { SITE_DEFAULTS } from "./defaults/siteDefaults";

type BuildSeoProps = {
  title?: string;
  description?: string;
  images?: string | string[];
  noIndex?: boolean;
  canonical?: string;
};

export async function buildSeo(page: BuildSeoProps = {}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteTitle = settings?.general?.title || SITE_DEFAULTS.general.title;
  const titleTemplate = settings?.seo?.defaultTitleTemplate || SITE_DEFAULTS.seo.defaultTitleTemplate;

  const finalTitle = page.title 
    ? titleTemplate.replace('%s', page.title)
    : siteTitle;
  
  const finalDescription = page.description || settings?.seo?.defaultDescription || SITE_DEFAULTS.seo.defaultDescription;

  const ogImages = Array.isArray(page.images) ? page.images : (page.images ? [page.images] : []);
  const finalOgImage = ogImages.length > 0 ? ogImages[0] : (settings?.seo?.ogImage || SITE_DEFAULTS.seo.ogImage);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonicalUrl = page.canonical ? new URL(page.canonical, siteUrl) : undefined;
  
  const robots = {
    index: page.noIndex ? false : (settings?.seo?.allowIndexing ?? true),
    follow: page.noIndex ? false : (settings?.seo?.allowIndexing ?? true),
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
  return buildSeo({
    title: page.title as string,
    description: page.description as string,
    images: (page.openGraph as any)?.images?.[0]?.url,
    noIndex: (page.robots as any)?.noindex,
    canonical: (page.alternates as any)?.canonical,
  });
}
