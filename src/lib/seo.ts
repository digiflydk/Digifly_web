import type { Metadata } from "next";

type TitleObject = { default: string; template?: string };
type TitleInput = string | TitleObject | null | undefined;

/**
 * Convert various title inputs into something Next Metadata accepts:
 * - string
 * - { default, template? }
 * - null/undefined -> undefined in Metadata
 */
export function toTitle(value: TitleInput): TitleObject | string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;

  // Ensure at least a default exists, even if caller passed only template
  const out: TitleObject = {
    default: value.default ?? "",
  };
  if (value.template) out.template = value.template;
  return out;
}

/**
 * Build a valid Metadata object.
 */
export function buildSeo(opts: {
  title?: TitleInput;
  description?: string | null;
  images?: string[] | string;
  canonical?: string | null;
}): Metadata {
  const ogImages = Array.isArray(opts.images)
    ? opts.images
    : opts.images
    ? [opts.images]
    : undefined;

  const m: Metadata = {
    title: toTitle(opts.title) as any,
    description: opts.description ?? undefined,
    alternates: opts.canonical ? { canonical: opts.canonical } : undefined,
    openGraph: {
      title: (opts.title as any) ?? undefined,
      description: opts.description ?? undefined,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: (opts.title as any) ?? undefined,
      description: opts.description ?? undefined,
      images: ogImages,
    },
  };

  return m;
}
