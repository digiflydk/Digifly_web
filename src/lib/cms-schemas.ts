import { z } from 'zod';

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
  logo: zMedia.partial().default({ src: '/logo.svg' }),
  favicon: zMedia.partial().default({ src: '/icon-192.png' })
}).default({ name: 'Digifly', logo: { src: '/logo.svg' }, favicon: { src: '/icon-192.png' } });


export const zDesignTokens = z.object({
  brand: zBrand.optional(),
  colors: z.object({
    primary: z.string().default('#111111'),
    accent: z.string().default('#6D5EF7'),
    bg: z.string().default('#FFFFFF'),
    muted: z.string().default('#6B7280'),
  }).default({}),
  typography: z.object({
    headline: z.string().default('Inter'),
    body: z.string().default('Inter'),
  }).default({}),
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

export const zCase = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  cover: zMedia,
  body: zRichText.optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
  updatedAt: z.number().optional()
});

const ServiceItemSchema = z.object({
  title: z.string().default('Service'),
  bullets: z.array(z.string()).default([]),
  href: z.string().default('#'),
});

export const zHome = z.object({
  hero: z.object({
    title: z.string().default('We build software, SaaS and automation that ship'),
    subtitle: z.string().default('We combine analytical strength with technology to create concrete solutions.'),
    primaryCta: z.object({
      label: z.string().default('Talk to us'),
      href: z.string().default('/#contact')
    }).default({}),
    image: zMedia.optional(),
  }).default({}),
  intro: z.object({
    tagline: z.string().default("Why • How • What"),
    heading: z.string().default('What we do'),
    body: z.string().default('Strategy & process optimization, software & automation with AI as an enabler.'),
    image: zMedia.optional(),
  }).default({}),
  servicesPreview: z.array(ServiceItemSchema).default([]),
  featuredCases: z.array(z.string()).default([]),
  cta: z.object({
    text: z.string().default("Let's build something intelligent together."),
    button: zNavLink.default({label: "Book a Call", href: "/contact"})
  }).default({}),
   seo: z.object({
    title: z.string().default('Digifly'),
    description: z.string().default('Strategy, Software & Automation with AI.')
  }).default({})
});

const zSeo = z.object({
    title: z.string(),
    description: z.string(),
}).default({ title: 'Digifly', description: 'Strategy, Software & Automation with AI.' });

export const zAboutPage = z.object({
    title: z.string().default('About Digifly'),
    subtitle: z.string().default('We build intelligent software that moves the needle.'),
    content: z.object({
        body: zRichText,
    }).default({ body: [] }),
    seo: zSeo,
});

export const zServicesPage = z.object({
    title: z.string().default('Services'),
    subtitle: z.string().default('Strategy, software & automation.'),
    content: z.object({
        services: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            bullets: z.array(z.string()),
        })).default([]),
    }).default({ services: [] }),
    seo: zSeo,
});

export const zCasesIndexPage = z.object({
    title: z.string().default('Our Work in Action'),
    subtitle: z.string().default('Selected projects and outcomes.'),
    seo: zSeo,
});

export const zContactPage = z.object({
    title: z.string().default('Contact'),
    subtitle: z.string().default('Let’s build something intelligent.'),
    seo: zSeo,
});