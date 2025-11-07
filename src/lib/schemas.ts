import { z } from "zod";
import { RichTextContent } from "./types";

// URL helper
export const UrlSchema = z
  .string()
  .url()
  .or(z.string().startsWith('/'))
  .or(z.literal(''));

export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string().url().or(z.string().startsWith("/")),
});
  
export const HeroSlideSchema = z.object({
  image: z.object({ src: UrlSchema.default(""), alt: z.string().default("") }).default({ src: "", alt: "" }),
  heading: z.string().default(""),
  subheading: z.string().default(""),
  body: z.string().default(""),
  cta: z.object({ label: z.string().default(""), href: UrlSchema.default("") }).default({ label: "", href: "" }),
  visible: z.boolean().default(true),
});

export const HomepageSchema = z.object({
  hero: z.object({
    slides: z.array(HeroSlideSchema).max(6).default([]),
    rotationDelaySec: z.coerce.number().refine(val => [3,5,8,10,15].includes(val), { message: "Must be 3, 5, 8, 10, or 15"}).default(5),
  }).default({ slides: [], rotationDelaySec: 5 }),
  intro: z.object({
    tagline: z.string().optional(),
    heading: z.string().optional(),
    body: z.string().optional(),
    image: z.object({
      src: z.string().optional(),
      alt: z.string().optional(),
      hint: z.string().optional(),
    }).optional(),
  }).optional(),
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
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const CaseSchema = z.object({
  id: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().optional(),
  excerpt: z.string().max(300).default(""),
  cover: z
    .object({
      src: UrlSchema.default(""),
      alt: z.string().default(""),
    })
    .default({ src: "", alt: "" }),
  content: z.any().optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});


export const SiteSettingsSchema = z.object({
  siteTitle: z.string().default(''),
  brand: z.object({
    name: z.string().default(''),
    logo: z.object({
      src: z.string().default(''),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().default('')
    }).default({}),
    favicon: z.object({
      src: z.string().default('')
    }).default({})
  }).default({}),
  social: z.object({
    tagline: z.string().default('')
  }).default({}),
  defaultSeo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    defaultThumbnailUrl: z.string().optional(),
  }).default({}),
});

export const FooterNavSchema = z.object({
    columns: z.array(z.object({
        title: z.string(),
        links: z.array(NavLinkSchema),
    })).default([])
});

export const NavigationSchema = z.object({
  header: z.array(NavLinkSchema).default([]),
  footer: FooterNavSchema.default({ columns: [] }),
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
