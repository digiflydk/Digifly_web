
import { z } from 'zod';
import type { RichTextContent } from './types';

export const SeoSchema = z.object({
  title: z.string().default("Digifly"),
  description: z.string().default("We build digital growth with AI, product thinking and execution."),
});

export const CoverSchema = z.object({
  src: z.string().min(1).default("/media/placeholder.jpg"),
  alt: z.string().default("Image"),
  hint: z.string().optional(),
});

export const MetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const RichBlockSchema: z.ZodType<RichTextContent> = z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
]);
export const RichBodySchema = z.array(RichBlockSchema).default([]);

export const PageBaseSchema = z.object({
  title: z.string().default("Untitled"),
  subtitle: z.string().default(""),
  seo: SeoSchema.default({}),
});

export const zNavLink = z.object({
  label: z.string(),
  href: z.string().url().or(z.string().startsWith("/")),
});


export const AboutPageSchema = PageBaseSchema.extend({
  body: RichBodySchema,
});
export const zAboutPage = AboutPageSchema;

export const ServicesPageSchema = PageBaseSchema.extend({
  services: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().default(""),
    bullets: z.array(z.string()).default([]),
  })).default([]),
});
export const zServicesPage = ServicesPageSchema;

export const ContactPageSchema = PageBaseSchema.extend({
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
export const zContactPage = ContactPageSchema;

export const CasesIndexSchema = PageBaseSchema;
export const zCasesIndexPage = CasesIndexSchema;

export const CaseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().default("Untitled case"),
  summary: z.string().default(""),
  seo: SeoSchema.default({}),
  cover: CoverSchema.default({}),
  body: RichBodySchema,
  metrics: z.array(MetricSchema).default([]),
  updatedAt: z.number().optional(),
});

export type CaseDoc = z.infer<typeof CaseSchema>;


// Helpers to parse + provide safe defaults
export function parseCase(input: unknown): CaseDoc {
  const parsed = CaseSchema.safeParse(input);
  if (!parsed.success) {
    // In production, you could capture parsed.error
    return {
      slug: "unknown-case",
      title: "Untitled Case",
      summary: "",
      seo: {},
      cover: { src: "/media/placeholder.jpg", alt: "Placeholder" },
      body: [],
      metrics: [],
    };
  }
  const v = parsed.data;
  return { ...v, body: v.body ?? [] };
}

/** NEW: Navigation schema */
const NavigationItemSchema = z.object({
  label: z.string(),
  href: z.string().default("#"),
});
export const NavigationSchema = z.object({
  header: z.array(zNavLink).default([]),
  footer: z.object({
      columns: z.array(z.object({
          title: z.string(),
          links: z.array(zNavLink),
      })).default([])
  }).default({ columns: [] }),
});
export const zNavigation = NavigationSchema;

/** NEW: Design settings schema */
export const DesignSettingsSchema = z.object({
  brand: z.object({
    name: z.string().default('Digifly'),
    logo: z.object({
        src: z.string().min(1, "Logo src is required"),
        width: z.number().optional(),
        height: z.number().optional(),
        alt: z.string().optional(),
    }).default({ src: '/logo.svg' }),
    favicon: z.object({ src: z.string().min(1).default("/favicon.ico") }).default({}),
  }).default({}),
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
export const zDesignSettings = DesignSettingsSchema;

/** NEW: Home page schema */
const ServiceItemSchema = z.object({
  title: z.string().default('Service'),
  bullets: z.array(z.string()).default([]),
  href: z.string().default('#'),
});
export const HomePageSchema = z.object({
  hero: z.object({
    title: z.string().default('We build software, SaaS and automation that ship'),
    subtitle: z.string().default('We combine analytical strength with technology to create concrete solutions.'),
    primaryCta: z.object({
      label: z.string().default('Talk to us'),
      href: z.string().default('/#contact')
    }).default({}),
    image: CoverSchema.optional(),
  }).default({}),
  intro: z.object({
    tagline: z.string().default("Why • How • What"),
    heading: z.string().default('What we do'),
    body: z.string().default('Strategy & process optimization, software & automation with AI as an enabler.'),
    image: CoverSchema.optional(),
  }).default({}),
  servicesPreview: z.array(ServiceItemSchema).default([]),
  featuredCases: z.array(z.string()).default([]),
  cta: z.object({
    text: z.string().default("Let's build something intelligent together."),
    button: zNavLink.default({label: "Book a Call", href: "/contact"})
  }).default({}),
   seo: z.object({
    title: z.string().default('Digifly'),
    description: z.string().default('Strategy, Software & Automation with AI.')
  }).default({})
});
export const zHome = HomePageSchema;


/** IMPORTANT: Export under the exact names cms-server expects */
export const zCase = CaseSchema;
