
import { z } from "zod";

// Base primitives
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const SiteSettingsSchema = z.object({
  general: z.object({
    brandName: z.string().min(1, "Brand name is required").default("Digifly"),
    logoUrl: z.string().url().or(z.literal("")).optional().default(""),
    faviconUrl: z.string().url().or(z.literal("")).optional().default(""),
  }).default({ brandName: "Digifly" }),
  contact: z.object({
    email: z.string().email("Invalid email").or(z.literal("")).optional().default(""),
    phone: z.string().optional().default(""),
    company: z.string().optional().default(""),
    street: z.string().optional().default(""),
    zip: z.string().optional().default(""),
    city: z.string().optional().default(""),
    country: z.string().optional().default("Denmark"),
  }).default({}),
  hours: z.record(z.string(), z.object({ enabled: z.boolean(), from: z.string(), to: z.string() }))
    .optional().default({}),
  seo: z.object({
    allowIndexing: z.boolean().default(true),
    defaultTitle: z.string().optional().default(''),
    defaultDescription: z.string().optional().default(""),
    ogImage: z.string().url().or(z.literal("")).optional().default(""),
    canonicalBase: z.string().url("Must be a full URL").or(z.literal("")).optional().default(""),
  }).default({ allowIndexing: true }),
});


export const NavigationSchema = z.object({
  header: z.array(z.object({ label: z.string(), href: z.string() })),
  footer: z.object({
    columns: z.array(z.object({
      title: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() }))
    }))
  })
});

export const HeroSlideSchema = z.object({
      heading: z.string(),
      subheading: z.string(),
      body: z.string(),
      image: z.object({ src: z.string(), alt: z.string() }),
      cta: z.object({ href: z.string(), label: z.string() }),
      visible: z.boolean().default(true)
});

export const HomepageSchema = z.object({
  hero: z.object({
    rotationDelaySec: z.number().default(6),
    slides: z.array(HeroSlideSchema)
  }),
  cta: z.object({
    text: z.string(),
    button: z.object({ label: z.string(), href: z.string() })
  }).optional(),
  intro: z.object({
    tagline: z.string().optional(),
    heading: z.string().optional(),
    body: z.string().optional(),
    image: z.object({
      src: z.string().optional(),
      alt: z.string().optional(),
      hint: z.string().optional()
    }).optional(),
  }).optional(),
  servicesPreview: z.array(z.object({
    title: z.string(),
    bullets: z.array(z.string()),
    href: z.string()
  })).optional(),
   featuredCases: z.array(z.string()).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional()
});

export const RichTextContentSchema = z.union([
  z.object({ type: z.literal('p'), text: z.string() }),
  z.object({ type: z.literal('list'), items: z.array(z.string()) }),
]);

export const AboutPageSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  content: z.object({ body: z.array(RichTextContentSchema).default([]) }).default({}),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const ServicesPageSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  content: z.object({
    services: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })).default([]),
  }).default({}),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const CasesIndexSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).default({}),
});

export const ContactPageSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const CaseSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});
export const CaseMetricSchema = z.object({ label: z.string(), value: z.string() });

export const CaseSchema = z.object({
  id: z.string().optional(),                  // used in tables & sitemap
  slug: z.string(),
  title: z.string(),
  published: z.boolean().default(false),
  status: z.enum(["draft","published"]).optional(),
  excerpt: z.string().optional(),
  summary: z.string().optional(),
  content: z.any().optional(),
  cover: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
  coverImage: z.object({ src: z.string(), alt: z.string().optional() }).optional(), // legacy alias
  seo: CaseSeoSchema.optional(),
  metrics: z.array(CaseMetricSchema).optional(),
  meta: z.object({ industry: z.string().optional(), tags: z.array(z.string()).optional() }).optional(),
  updatedAt: z.string().or(z.date()).or(z.number()).optional(),
});

export type AdminAction = "site-seo.save" | "site-seo.preview" | "site-seo.deploy" | "homepage.save" | "cases.save" | "playwright.run";
export interface AuditLog {
  action: AdminAction;
  actorUid: string | null;
  actorEmail?: string | null;
  path?: string;
  payloadSummary?: string;
  status: "ok" | "error";
  errorMessage?: string;
  ts: any; // Using `any` for Firebase's serverTimestamp()
  version?: string;
}

// ---- Shim the names used across the app (from error logs) ----
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type HomePage   = z.infer<typeof HomepageSchema>;
export const BasePageSchema = z.object({ slug: z.string(), title: z.string().optional() });
export const NavItemSchema  = z.object({ label: z.string(), href: z.string() });
export const BrandSchema    = z.object({
  name: z.string(),
  logo: z.object({ src: z.string(), alt: z.string(), height: z.number().optional(), width: z.number().optional() }),
  favicon: z.object({ src: z.string() })
});
export const DesignSettingsSchema = SiteSettingsSchema; // alias to satisfy imports
export type Navigation = z.infer<typeof NavigationSchema>;
export type HeroSlide = z.infer<typeof HomepageSchema>["hero"]["slides"][number];


export const allSchemas = {
  SiteSettingsSchema,
  NavigationSchema,
  HomepageSchema,
  CaseSchema,
  AboutPageSchema,
  ServicesPageSchema,
  CasesIndexSchema,
  ContactPageSchema,
};
