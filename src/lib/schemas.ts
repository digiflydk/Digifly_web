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

export const zNavLink = z.object({
  label: z.string(),
  href: z.string().url().or(z.string().startsWith("/")),
});

export const zMedia = z.object({
    src: z.string().min(1).default('/og-default.jpg'),
    alt: z.string().optional(),
    hint: z.string().optional(),
});

export const zRichText = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
).default([]);

export const zBrand = z.object({
  name: z.string().default('Digifly'),
  logo: z.object({
      src: z.string().min(1, "logo src required"),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional(),
  }).default({ src: '/logo.svg', alt: 'Digifly logo' }),
  favicon: z.object({ src: z.string().min(1).default("/favicon.ico") }).default({src: "/favicon.ico"}),
}).default({ logo: { src: '/logo.svg' } });


export const zDesignSettings = z.object({
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


export const zFooterNav = z.object({
    columns: z.array(z.object({
        title: z.string(),
        links: z.array(zNavLink),
    })).default([])
});

export const zNavigation = z.object({
  header: z.array(zNavLink).default([]),
  footer: zFooterNav.default({ columns: [] }),
});

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

export const HomeSchema = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subcopy: z.string().optional().default(''),
    ctaLabel: z.string().optional().default(''),
    ctaHref: z.string().optional().default(''),
    image: zMedia.optional(),
  }),
  features: z.array(z.object({
    title: z.string().min(1),
    text: z.string().optional().default(''),
    icon: zMedia.optional(),
  })).default([]),
  clients: z.array(z.object({
    name: z.string().min(1),
    logo: zMedia,
    href: z.string().optional(),
  })).default([]),
  seo: SeoSchema.optional(),
});
export const zHome = HomeSchema;

export const AboutPageSchema = z.object({
  title: z.string(),
  subtitle: z.string().default(""),
  seo: SeoSchema.default(makeSeo("About", "")),
  body: z.array(z.any()).default([]),
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

export const NavigationSchema = z.object({
  primary: z.array(NavItemSchema).default([]),
  footer: z.array(NavItemSchema).default([]),
});

export const HomepageSchema = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subcopy: z.string().optional().default(''),
    ctaLabel: z.string().optional().default(''),
    ctaHref: z.string().optional().default(''),
    image: zMedia.optional(),
  }),
  features: z.array(z.object({
    title: z.string().min(1),
    text: z.string().optional().default(''),
  })).default([]),
  caseSpotlight: z.string().optional(),
  newsletter: z.object({
    enabled: z.boolean().default(false),
    listId: z.string().optional().default(''),
  }).default({}),
});


export type CaseDoc = z.infer<typeof CaseSchema>;

export const parseCase = (data: unknown) => CaseSchema.parse(data);
