
import { z } from "zod";

// This validator handles absolute URLs, root-relative paths, or an empty string.
// It correctly parses URLs with query strings to check file extensions.
export const imageSrc = z.string().trim().refine(
  (v) => {
    if (v === '') return true; // Allow empty string
    if (!v.startsWith('http') && !v.startsWith('/')) return false; // Must be absolute or root-relative
    try {
      // Use a dummy base for relative paths to allow URL parsing.
      // The pathname will correctly exclude query strings.
      const url = new URL(v, 'https://dummy.base');
      return /\.(png|jpg|jpeg|svg|ico)$/i.test(url.pathname);
    } catch {
      return false; // Invalid URL format
    }
  },
  {
    message: 'Must be an absolute URL (https://...), a root-relative path (e.g. /favicon.ico), or an empty string. Only .png, .jpg, .jpeg, .svg, or .ico files are allowed.',
  }
);


// Base Schemas
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const MediaSchema = z.object({
    src: imageSrc.default(''),
    alt: z.string().optional().default(''),
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
      src: imageSrc.default(''),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional().default('Digifly Logo'),
  }).optional().default({ src: '' }),
  favicon: z.object({ 
    src: imageSrc.default("") 
  }).optional().default({ src: '' }),
}).optional().default({});

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
  }).default({ columns: [] })
});

const PageContentSchema = z.object({
  body: RichTextSchema,
}).default({ body: [] });

const SeoSchema = z.object({
  title: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export const CaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().default(""),
  seo: SeoSchema.optional(),
  cover: MediaSchema.default({ src: '' }),
  content: PageContentSchema.optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  updatedAt: z.number().optional(),
});

// Page-specific schemas
const IntroSchema = z.object({
  tagline: z.string().optional().default(''),
  heading: z.string().default(''),
  body: z.string().default(''),
  image: MediaSchema.optional(),
}).default({});

export const HomepageSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional().default(''),
    primaryCta: NavLinkSchema.optional(),
    image: MediaSchema.optional(),
  }).default({ title: 'Default Hero Title' }),
  intro: IntroSchema,
  servicesPreview: z.array(z.object({
    title: z.string(),
    bullets: z.array(z.string()),
    href: z.string(),
  })).default([]),
  featuredCases: z.array(z.string()).default([]),
  cta: z.object({
    text: z.string(),
    button: NavLinkSchema,
  }).optional(),
  seo: SeoSchema.optional(),
});

export const BasePageSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().default(""),
  seo: SeoSchema.optional(),
  content: PageContentSchema.optional(),
});

export const AboutPageSchema = BasePageSchema.extend({
  title: z.string().default('About Digifly'),
  seo: SeoSchema.optional(),
  content: PageContentSchema.default({ body: [] }),
});

export const ServicesPageSchema = z.object({
  title: z.string().default('Services'),
  subtitle: z.string().default(""),
  seo: SeoSchema.optional(),
  content: z.object({
      services: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        bullets: z.array(z.string()),
      })).default([]),
  }).default({ services: [] }),
});

export const CasesIndexSchema = z.object({
  title: z.string().default('Our Work'),
  subtitle: z.string().default(""),
  seo: SeoSchema.optional(),
});

export const ContactPageSchema = z.object({
  title: z.string().default('Contact Us'),
  subtitle: z.string().default(""),
  seo: SeoSchema.optional(),
});

export const SiteSettingsSchema = z.object({
  siteTitle: z.string().min(1, 'Site Title is required').default('Digifly'),
  social: z.object({
    tagline: z.string().optional().default('')
  }).optional().default({}),
  brand: BrandSchema,
  defaultSeo: z.object({
    description: z.preprocess(
      (v) => (typeof v === "string" ? v.trim() : v),
      z.string().max(160, "Description must be 160 characters or less").optional().default('')
    ),
    title: z.string().optional().default(''),
  }).optional().default({})
});

export const NavItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().int().default(0),
});

export const allSchemas = {
    SiteSettingsSchema,
    BasePageSchema,
    NavigationSchema,
    CaseSchema,
};

export type CaseDoc = z.infer<typeof CaseSchema>;
export const parseCase = (data: unknown) => CaseSchema.parse(data);
