import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export function buildMeta({title,description,image}:{title:string;description:string;image?:string}): Metadata {
  const seoImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}/og-image.png`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{url: seoImage}] : [],
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card:"summary_large_image",
      title,
      description,
      images: image ? [seoImage] : [],
      creator: "@shadcn",
    },
    alternates: {
      canonical: siteConfig.url
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
    image: image
  })
}
