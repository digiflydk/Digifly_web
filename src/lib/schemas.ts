
"use server";

import { z } from "zod";

// Base primitives
export const CmsLinkSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("internal"),
    internalRef: z.string().min(1, "Internal page is required"),
    label: z.string().min(1, "Label is required"),
    newTab: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("external"),
    externalUrl: z.string().url("Enter a valid URL"),
    label: z.string().min(1, "Label is required"),
    newTab: z.boolean().default(false),
  }),
]);

export const NavLinkSchema = z.object({
  id: z.string().optional(), // for useFieldArray key
  link: CmsLinkSchema
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
  header: z.array(NavLinkSchema).default([]),
  footer: z.object({
    columns: z.array(z.object({
      title: z.string().min(1),
      links: z.array(NavLinkSchema)
    })).default([])
  })
});

export const HeroSlideSchema = z.object({
      heading: z.string().default(''),
      subheading: z.string().optional().default(''),
      body: z.string().optional().default(''),
      image: z.object({ 
        src: z.string().optional().default(''), 
        alt: z.string().optional().default('')
      }).optional().default({}),
      cta: CmsLinkSchema.optional(),
      visible: z.boolean().default(true)
});

export const WhatWeDoSchema = z.object({
  enabled: z.boolean().default(true),
  subtitle: z.string(),
  title: z.string(),
  body: z.string(),
  image: z.object({
    src: z.string(),
    alt: z.string().default(""),
  }),
  cta: CmsLinkSchema.optional(),
});

export const ServiceItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  body: z.string().default(""),
  link: CmsLinkSchema.optional().nullable(),
});

export const ServicesSchema = z.object({
  enabled: z.boolean().default(true),
  subtitle: z.string(),
  title: z.string(),
  items: z.array(ServiceItemSchema),
});


export const HomepageSchema = z.object({
  hero: z.object({
    rotationDelaySec: z.number().default(5),
    slides: z.array(HeroSlideSchema).default([])
  }),
  whatWeDo: WhatWeDoSchema.optional(),
  services: ServicesSchema.optional(),
  featuredCases: z.array(z.string()).optional(),
  cta: z.object({
    text: z.string(),
    button: CmsLinkSchema
  }).optional(),
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
  cover: z.object({ 
    src: z.string().default(""), 
    alt: z.string().optional() 
  }).optional(),
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
export const NavItemSchema  = NavLinkSchema;
export const BrandSchema    = z.object({
  name: z.string(),
  logo: z.object({ src: z.string(), alt: z.string(), height: z.number().optional(), width: z.number().optional() }),
  favicon: z.object({ src: z.string() })
});
export const DesignSettingsSchema = SiteSettingsSchema; // alias to satisfy imports
export type Navigation = z.infer<typeof NavigationSchema>;
export type HeroSlide = z.infer<typeof HeroSlideSchema>;
export type Case = z.infer<typeof CaseSchema>;
export type WhatWeDo = z.infer<typeof WhatWeDoSchema>;
export type ServiceItem = z.infer<typeof ServiceItemSchema>;
export type Services = z.infer<typeof ServicesSchema>;


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
