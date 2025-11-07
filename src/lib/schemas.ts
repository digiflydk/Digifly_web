import { z } from "zod";
import { ImageUrlSchema } from './validators';

// Base Schemas
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const MediaSchema = z.object({
    src: ImageUrlSchema.optional().default(''),
    alt: z.string().optional().default(''),
    hint: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
}).default({});

export const RichTextSchema = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
).default([]);

export const BrandSchema = z.object({
  name: z.string().optional().default('Digifly'),
  logo: z.object({
      src: ImageUrlSchema.optional().default(''),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional().default('Digifly Logo'),
  }).optional().default({ src: '' }),
  favicon: z.object({ 
    src: ImageUrlSchema.optional().default('/favicon.ico'),
  }).optional().default({ src: '/favicon.ico' }),
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
  id: z.string().optional(),
  slug: z.string().min(1, "Slug is required."),
  title: z.string().min(1, "Title is required."),
  summary: z.string().optional().default(""),
  published: z.boolean().default(false),
  order: z.number().optional().default(0),
  seo: SeoSchema.optional(),
  cover: MediaSchema,
  content: PageContentSchema.optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  updatedAt: z.any().optional(),
  createdAt: z.any().optional(),
});

// Page-specific schemas
const IntroSchema = z.object({
  tagline: z.string().optional().default('Why • How • What'),
  heading: z.string().default(''),
  body: z.string().default(''),
  image: MediaSchema.optional(),
}).default({});

export const HomepageSchema = z.object({
  hero: z.object({
    title: z.string().min(1, "Hero title is required").default('From Idea to Intelligent Solution'),
    subtitle: z.string().optional().default(''),
    primaryCta: NavLinkSchema.optional(),
    images: z.array(MediaSchema).max(6).default([]),
    rotate: z.boolean().default(true),
    delaySec: z.enum([3, 5, 8, 10, 15]).default(5),
  }).default({ images: [], rotate: true, delaySec: 5, title: '' }),
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
})
.transform(data => {
  // @ts-ignore - backward compatibility for old single image
  const oldImageSrc = data.hero?.image?.src;
  if (oldImageSrc && (!data.hero.images || data.hero.images.length === 0)) {
    data.hero.images = [{ src: oldImageSrc, alt: data.hero.image.alt || '' }];
  }
  // @ts-ignore
  if (data.hero.image) delete data.hero.image;
  return data;
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
