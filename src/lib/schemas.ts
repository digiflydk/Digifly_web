
import { z } from 'zod';
import type { RichTextContent } from './types';

export const zNavLink = z.object({
  label: z.string(),
  href: z.string().url().or(z.string().startsWith("/")),
});

export const zMedia = z.object({
    src: z.string().min(1).default('/og-default.jpg'),
    alt: z.string().optional(),
    hint: z.string().optional(),
});

export const zRichText = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
).default([]);

export const zBrand = z.object({
  name: z.string().default('Digifly'),
  logo: z.object({
      src: z.string().min(1, "logo src required"),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional(),
  }).default({ src: '/logo.svg', alt: 'Digifly logo' }),
  favicon: z.object({ src: z.string().min(1).default("/favicon.ico") }).default({src: "/favicon.ico"}),
}).default({ logo: { src: '/logo.svg' } });


export const zDesignSettings = z.object({
  brand: zBrand.optional(),
  colors: z.object({
    primary: z.string().default('#6C3CF6'),
    accent: z.string().default('#22C55E'),
    bg: z.string().default('#F6F7FB'),
    muted: z.string().default('#E5E7EB'),
  }).default({}),
  typography: z.object({
    headline: z.string().default('Inter'),
    body: z.string().default('Inter'),
  }).default({})
});


export const zFooterNav = z.object({
    columns: z.array(z.object({
        title: z.string(),
        links: z.array(zNavLink),
    })).default([])
});

export const zNavigation = z.object({
  header: z.array(zNavLink).default([]),
  footer: zFooterNav.default({ columns: [] }),
});

const SeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
});

// tiny helper for defaults
const makeSeo = (title: string, description: string = "") => ({
  title,
  description,
});

export const zCase = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().default(""),
  cover: z.object({
    src: z.string(),
    alt: z.string().default(""),
    hint: z.string().optional(),
  }),
  body: z.array(z.any()).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  seo: SeoSchema.default(makeSeo("Untitled Case", "")),
  updatedAt: z.number().optional(),
});


const ServiceItemSchema = z.object({
  title: z.string().default('Service'),
  bullets: z.array(z.string()).default([]),
  href: z.string().default('#'),
});

export const zHome = z.object({
  hero: z.object({
    title: z.string().default('We build software, SaaS and automation that ship'),
    subtitle: z.string().default('We combine analytical strength with technology to create concrete solutions.'),
    primaryCta: z.object({
      label: z.string().default('Talk to us'),
      href: z.string().default('/#contact')
    }).default({}),
    image: zMedia.optional(),
  }).default({}),
  intro: z.object({
    tagline: z.string().default("Why • How • What"),
    heading: z.string().default('What we do'),
    body: z.string().default('Strategy & process optimization, software & automation with AI as an enabler.'),
    image: zMedia.optional(),
  }).default({}),
  servicesPreview: z.array(ServiceItemSchema).default([]),
  featuredCases: z.array(z.string()).default([]),
  cta: z.object({
    text: z.string().default("Let's build something intelligent together."),
    button: zNavLink.default({label: "Book a Call", href: "/contact"})
  }).default({}),
   seo: SeoSchema.default(makeSeo('Digifly', 'Strategy, Software & Automation with AI.'))
});

export const zAboutPage = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("About", "")),
  body: z.array(z.any()).default([]),
});

export const zServicesPage = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("Services", "")),
  content: z.object({
      services: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        bullets: z.array(z.string()),
      })),
  }),
});


export const zCasesIndexPage = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("Cases", "")),
});

export const zContactPage = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("Contact", "")),
});
