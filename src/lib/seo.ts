import { siteConfig } from "@/config/site";
import { Metadata } from "next";

type Og = { title: string; description?: string; url?: string; images?: string[] };

export function buildMeta({title, description, url, og}: { title: string; description?: string; url?: string; og?: Partial<Og> }): Metadata {
  const seoImage = og?.images?.length ? og.images[0] : `${siteConfig.url}/og-default.jpg`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seoImage ? [{url: seoImage}] : [],
      url: url || siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card:"summary_large_image",
      title,
      description,
      images: seoImage ? [seoImage] : [],
      creator: "@shadcn",
    },
    alternates: {
      canonical: url || siteConfig.url,
    }
  };
}

export function metaDefaults({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return buildMeta({
    title: title ?? siteConfig.name,
    description: description ?? siteConfig.description,
    og: { images: image ? [image] : [] },
  })
}
