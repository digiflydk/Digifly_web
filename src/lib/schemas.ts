
import { z } from "zod";

// Base primitives
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const SiteSettingsSchema = z.object({
  siteTitle: z.string(),
  brand: z.object({
    name: z.string(),
    logo: z.object({
      src: z.string(),
      alt: z.string(),
      height: z.number().optional(),
      width: z.number().optional(),
    }),
    favicon: z.object({ src: z.string() })
  }),
  social: z.object({ tagline: z.string() }),
  defaultSeo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    defaultThumbnailUrl: z.string().optional(),
  })
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

export const CaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  status: z.enum(['draft', 'published']).optional(),
  summary: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  cover: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  meta: z.object({ industry: z.string().optional(), tags: z.array(z.string()).optional() }).optional(),
  content: z.any().optional()
});


// ---- Shim the names used across the app (from error logs) ----
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type HomePage   = z.infer<typeof HomepageSchema>;
export type CaseDoc    = z.infer<typeof CaseSchema>;
export const BasePageSchema = z.object({ slug: z.string(), title: z.string().optional() });
export const NavItemSchema  = z.object({ label: z.string(), href: z.string() });
export const BrandSchema    = z.object({
  name: z.string(),
  logo: z.object({ src: z.string(), alt: z.string(), height: z.number().optional(), width: z.number().optional() }),
  favicon: z.object({ src: z.string() })
});
export const DesignSettingsSchema = SiteSettingsSchema; // alias to satisfy imports

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
