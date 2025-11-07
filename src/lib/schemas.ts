
import { z } from "zod";

// Reusable Zod helpers for common validation patterns.
const httpUrl = z.string().url("Must be a valid URL (e.g., https://...)");
const pathUrl = z.string().regex(/^\/[^\s]*$/, 'Must start with a "/"');
export const imageSrc = z.union([httpUrl, pathUrl]);
export const optionalUrl = z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().url("Must be a valid URL (e.g., https://...)").optional()
);
export const urlOrEmpty = z.union([httpUrl, z.literal("")]);

// Base Schemas
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.union([httpUrl, pathUrl]),
});

export const MediaSchema = z.object({
    src: imageSrc.default('/og-default.jpg'),
    alt: z.string().optional(),
    hint: z.string().optional(),
});

export const RichTextSchema = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
).default([]);

export const BrandSchema = z.object({
  name: z.string().default('Digifly'),
  logo: z.object({
      src: imageSrc.default('/logo.svg'),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().default('Digifly Logo'),
  }).default({ src: '/logo.svg' }),
  favicon: z.object({ 
    src: imageSrc.default("/favicon.ico") 
  }).default({src: "/favicon.ico"}),
}).default();

export const DesignSettingsSchema = z.object({
  brand: BrandSchema.optional(),
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

export const NavigationSchema = z.object({
  header: z.array(NavLinkSchema).default([]),
  footer: z.object({
      columns: z.array(z.object({
        title: z.string(),
        links: z.array(NavLinkSchema)
      })).default([{ title: 'Links', links: [] }])
  })
});

const PageContentSchema = z.object({
  body: RichTextSchema,
});

const SeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const CaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().default(""),
  seo: SeoSchema.optional(),
  cover: z.object({
    src: z.string(),
    alt: z.string().default(""),
    hint: z.string().optional(),
  }),
  content: PageContentSchema.default({ body: [] }),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  updatedAt: z.number().optional(),
});

// Page-specific schemas
const IntroSchema = z.object({
  tagline: z.string().optional(),
  heading: z.string(),
  body: z.string(),
  image: MediaSchema.optional(),
}).optional();

export const HomepageSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional().default(''),
    primaryCta: NavLinkSchema.optional(),
    image: MediaSchema.optional(),
  }),
  intro: IntroSchema,
  servicesPreview: z.array(z.object({
    title: z.string(),
    bullets: z.array(z.string()),
    href: z.string(),
  })).optional(),
  featuredCases: z.array(z.string()).optional(),
  cta: z.object({
    text: z.string(),
    button: NavLinkSchema,
  }).optional(),
  seo: SeoSchema.optional(),
});

const BasePageSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().default(""),
  seo: SeoSchema.optional(),
  content: PageContentSchema,
});

export const AboutPageSchema = BasePageSchema.extend({
  title: z.string().default('About Digifly'),
  seo: SeoSchema.optional(),
  content: PageContentSchema.default({ body: [] }),
});

export const ServicesPageSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.optional(),
  content: z.object({
      services: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        bullets: z.array(z.string()),
      })),
  }),
});

export const CasesIndexSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.optional(),
});

export const ContactPageSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.optional(),
});

export const SiteSettingsSchema = z.object({
  siteTitle: z.string().min(1, 'Site Title is required').default('Digifly'),
  social: z.object({
    tagline: z.string().optional()
  }).optional(),
  brand: z.object({
    name: z.string().default("Digifly"),
    logo: z.object({ 
        src: imageSrc, 
        alt: z.string().default("Logo"), 
    }),
    favicon: z.object({ 
        src: imageSrc
    })
  }),
  defaultSeo: z.object({
    description: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : v),
      z.string().max(160, "Description must be 160 characters or less").optional()
    )
  }).optional()
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;


export const NavItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().int().default(0),
});

export type CaseDoc = z.infer<typeof CaseSchema>;
export const parseCase = (data: unknown) => CaseSchema.parse(data);
