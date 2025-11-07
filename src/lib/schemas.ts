

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
      src: z.string().url().or(z.string().startsWith('/')).min(1, "logo src required"),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional().default('Digifly Logo'),
  }).default({ src: '/logo.svg' }),
  favicon: z.object({ 
    src: z.string().url().or(z.string().startsWith('/')).min(1).default("/favicon.ico") 
  }).default({src: "/favicon.ico"}),
}).default();
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
      })).default([{ title: 'Links', links: [] }])
  })
});
export const zNavigation = NavigationSchema;

const PageContentSchema = z.object({
  body: RichTextSchema,
});
export const zPageContent = PageContentSchema;

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
  content: PageContentSchema.default({ body: [] }),
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

const BasePageSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional().default(""),
  seo: SeoSchema,
  content: PageContentSchema,
});
export const zBasePage = BasePageSchema;

export const AboutPageSchema = BasePageSchema.extend({
  title: z.string().default('About Digifly'),
  seo: SeoSchema.default(makeSeo("About", "")),
  content: PageContentSchema.default({ body: [] }),
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

export const SiteSettingsSchema = z.object({
  siteTitle: z.string(),
  social: z.object({
    tagline: z.string().optional()
  }).optional(),
  brand: z.object({
    name: z.string().default("Digifly"),
    logo: z.object({ 
        src: z.string().url(), 
        alt: z.string().default("Digifly Logo"), 
        width: z.number().optional(), 
        height: z.number().optional() 
    }),
    favicon: z.object({ 
        src: z.string().url().or(z.literal("/favicon.ico")) 
    })
  }).optional(),
  defaultSeo: z.object({
    description: z.string().max(320).optional()
  }).optional()
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export const zSiteSettings = SiteSettingsSchema;


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
