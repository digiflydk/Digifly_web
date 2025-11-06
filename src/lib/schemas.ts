
import { z } from "zod";

// tiny helper for defaults
const makeSeo = (title: string, description: string = "") => ({
  title,
  description,
});

export const SeoSchema = z.object({
  title: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string().url().or(z.string().startsWith("/")),
});
export const zNavLink = NavLinkSchema;

export const MediaSchema = z.object({
    src: z.string().min(1).default('/og-default.jpg'),
    alt: z.string().optional(),
    hint: z.string().optional(),
});
export const zMedia = MediaSchema;

export const RichTextSchema = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
).default([]);
export const zRichText = RichTextSchema;

export const BrandSchema = z.object({
  name: z.string().default('Digifly'),
  logo: z.object({
      src: z.string().min(1, "logo src required"),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional(),
  }).default({ src: '/logo.svg', alt: 'Digifly logo' }),
  favicon: z.object({ src: z.string().min(1).default("/favicon.ico") }).default({src: "/favicon.ico"}),
}).default({ logo: { src: '/logo.svg' } });
export const zBrand = BrandSchema;


export const DesignSettingsSchema = z.object({
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
export const zDesignSettings = DesignSettingsSchema;


export const FooterNavSchema = z.object({
    columns: z.array(z.object({
        title: z.string(),
        links: z.array(zNavLink),
    })).default([])
});
export const zFooterNav = FooterNavSchema;

export const NavigationSchema = z.object({
  header: z.array(zNavLink).default([]),
  footer: z.object({
      columns: z.array(z.object({
        title: z.string(),
        links: z.array(zNavLink)
      })).default([])
  })
});
export const zNavigation = NavigationSchema;

export const CaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().default(""),
  seo: SeoSchema.default(makeSeo("Untitled Case", "")),
  cover: z.object({
    src: z.string(),
    alt: z.string().default(""),
    hint: z.string().optional(),
  }),
  body: z.array(z.any()).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  updatedAt: z.number().optional(),
});
export const zCase = CaseSchema;


const ServiceItemSchema = z.object({
  title: z.string().default('Service'),
  bullets: z.array(z.string()).default([]),
  href: z.string().default('#'),
});

const zIntro = z.object({
  tagline: z.string().optional(),
  heading: z.string(),
  body: z.string(),
  image: zMedia.optional(),
}).optional();

const zServicesPreview = z.array(z.object({
  title: z.string(),
  bullets: z.array(z.string()),
  href: z.string(),
})).optional();

const zFeaturedCases = z.array(z.string()).optional();

const zCTA = z.object({
  text: z.string(),
  button: NavLinkSchema,
}).optional();


export const HomepageSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional().default(''),
    primaryCta: NavLinkSchema.optional(),
    image: zMedia.optional(),
  }),
  intro: zIntro,
  servicesPreview: zServicesPreview,
  featuredCases: zFeaturedCases,
  cta: zCTA,
  seo: SeoSchema.optional(),
});
export const zHome = HomepageSchema;
export const zHomepage = HomepageSchema;

export const AboutPageSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("About", "")),
  content: z.object({
    body: zRichText.default([]),
  }),
});
export const zAboutPage = AboutPageSchema;

export const ServicesPageSchema = z.object({
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
export const zServicesPage = ServicesPageSchema;

export const CasesIndexSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("Cases", "")),
});
export const zCasesIndexPage = CasesIndexSchema;

export const ContactPageSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("Contact", "")),
});
export const zContactPage = ContactPageSchema;

export const SiteSchema = z.object({
  siteTitle: z.string().min(1),
  tagline: z.string().optional().default(''),
  logo: zMedia,
  favicon: zMedia,
  defaultSeo: SeoSchema.optional(),
  social: z.object({
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    facebook: z.string().url().optional(),
  }).partial().default({}),
});

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
