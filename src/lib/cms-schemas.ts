import { z } from "zod";

export const zNavLink = z.object({ label: z.string(), href: z.string().url().or(z.string().startsWith("/")) });

export const zBrand = z.object({
  logo: z.object({
    src: z.string().url(),
    width: z.number().optional(),
    height: z.number().optional(),
    alt: z.string().optional()
  }).optional(),
  favicon: z.object({
    src: z.string().url()
  }).optional()
});

export const zDesignTokens = z.object({
  version: z.string(),
  colors: z.object({
    primary: z.string(),
    electricBlue: z.string(),
    digitalPurple: z.string(),
    graphiteGrey: z.string(),
    platinumGrey: z.string(),
    softWhite: z  .string(),
    success: z.string(),
    error: z.string(),
  }),
  fonts: z.object({ headline: z.string(), body: z.string() }),
  radius: z.object({ buttonPill: z.number(), card: z.number() }),
  typography: z.object({
    h1: z.number(),
    h2: z.number(),
    h3: z.number(),
    body: z.number(),
    caption: z.number(),
    lineHeight: z.number(),
  }),
  brand: zBrand.optional()
});


export const zNavigation = z.object({
  header: z.array(zNavLink),
  footer: z.object({
    links: z.array(zNavLink),
    company: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      address: z.string(),
    }),
    social: z.array(zNavLink),
  }),
});

export const zMedia = z.object({
    src: z.string(),
    alt: z.string(),
    hint: z.string().optional(),
});

export const zRichText = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
);

export const zCase = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  cover: zMedia,
  body: zRichText,
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
  updatedAt: z.number().optional()
});


export const zHome = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    primaryCta: zNavLink,
    image: zMedia,
  }),
  intro: z.object({
    tagline: z.string(),
    heading: z.string(),
    body: z.string(),
    image: zMedia,
  }),
  servicesPreview: z.array(
    z.object({
      title: z.string(),
      bullets: z.array(z.string()),
      href: z.string(),
    })
  ),
  featuredCases: z.array(z.string()),
  cta: z.object({
    text: z.string(),
    button: zNavLink,
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
});