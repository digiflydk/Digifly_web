
export type OgImage = { src: string; alt?: string };
export type SeoLike = {
  title?: string;
  description?: string;
  ogImage?: OgImage | null;
  twitterCard?: "summary" | "summary_large_image";
};

export const DEFAULT_SEO: Required<Omit<SeoLike, "ogImage">> & { ogImage: OgImage } = {
  title: "",
  description: "",
  twitterCard: "summary_large_image",
  ogImage: { src: "", alt: "" },
};

export function withSeoDefaults(input?: SeoLike | null): Required<SeoLike> {
  const og = input?.ogImage ?? DEFAULT_SEO.ogImage;
  return {
    title: input?.title ?? DEFAULT_SEO.title,
    description: input?.description ?? DEFAULT_SEO.description,
    twitterCard: input?.twitterCard ?? DEFAULT_SEO.twitterCard,
    ogImage: { src: og.src ?? "", alt: og.alt ?? "" },
  };
}
