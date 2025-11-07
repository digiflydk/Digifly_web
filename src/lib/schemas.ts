
import { z } from "zod";
import { normalizeImageSrc } from "./cms-normalize";

// Reusable Schemas
export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const ImageUrlSchema = z.string()
  .transform(v => normalizeImageSrc(v))
  .superRefine((v, ctx) => {
    if (!v) return; // empty is allowed
    const hasGoodPrefix = v.startsWith('https://') || v.startsWith('/');
    if (!hasGoodPrefix) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be https:// or root-relative (/...)' });
      return;
    }
    const bare = v.split(/[?#]/)[0].toLowerCase();
    const allowed = ['.png','.jpg','.jpeg','.svg','.ico','.webp'];
    if (!allowed.some(ext => bare.endsWith(ext))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid file extension. Allowed: png, jpg, jpeg, svg, ico, webp.' });
    }
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

const PageContentSchema = z.object({
  body: RichTextSchema,
}).default({ body: [] });

const SeoSchema = z.object({
  title: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export const HeroSlideSchema = z.object({
  image: MediaSchema.default({ src: "", alt: "" }),
  title: z.string().max(120).default(""),
  subtitle: z.string().max(160).default(""),
  body: z.string().max(600).default(""),
  primaryCtaLabel: z.string().max(40).default(""),
  primaryCtaHref: z.string().default(""),
  secondaryCtaLabel: z.string().max(40).default(""),
  secondaryCtaHref: z.string().default(""),
  visible: z.boolean().default(true),
});


// Page-specific schemas
const IntroSchema = z.object({
  tagline: z.string().optional(),
  heading: z.string().default(''),
  body: z.string().default(''),
  image: MediaSchema.optional(),
}).default({});

export const HomepageSchema = z.object({
  hero: z.object({
    slides: z.array(HeroSlideSchema).default([]),
    rotationDelaySec: z.enum(['3', '5', '8', '10', '15']).transform(Number).default(5),
  }).default({ slides: [], rotationDelaySec: 5 }),
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

// Other Schemas
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

export const NavigationSchema = z.object({
  header: z.array(NavLinkSchema).default([]),
  footer: z.object({
      columns: z.array(z.object({
        title: z.string(),
        links: z.array(NavLinkSchema)
      })).default([{ title: 'Links', links: [] }])
  }).default({ columns: [] })
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

export const allSchemas = {
    SiteSettingsSchema,
    BasePageSchema,
    NavigationSchema,
    CaseSchema,
};

export type CaseDoc = z.infer<typeof CaseSchema>;
export const parseCase = (data: unknown) => CaseSchema.parse(data);
