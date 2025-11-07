import { z } from "zod";

// URL schema already present in project; if not, keep this minimal variant:
export const UrlSchema = z
  .string()
  .url()
  .or(z.string().startsWith("/"))
  .or(z.literal(""));

/** HOMEPAGE */
export const HomepageSlideSchema = z.object({
  image: z.object({ src: UrlSchema.default(""), alt: z.string().default("") }).default({ src: "", alt: "" }),
  heading: z.string().default(""),
  subheading: z.string().default(""),
  body: z.string().default(""),
  cta: z.object({ label: z.string().default(""), href: UrlSchema.default("") }).default({ label: "", href: "" }),
});

export const HomepageSchema = z.object({
  hero: z.object({
    slides: z.array(HomepageSlideSchema).max(6).default([]),
    rotationDelaySec: z.enum(["3","5","8","10","15"]).default("5"),
  }).default({ slides: [], rotationDelaySec: "5" }),
});

export type HomePage = z.infer<typeof HomepageSchema>;


export const CaseSchema = z.object({
  status: z.enum(["draft", "published"]).default("draft"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().max(300).default(""),
  cover: z
    .object({
      src: UrlSchema.default(""),
      alt: z.string().default(""),
    })
    .default({ src: "", alt: "" }),
  content: z.any().optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().optional(),
});

export type CaseDoc = z.infer<typeof CaseSchema> & { id?: string };