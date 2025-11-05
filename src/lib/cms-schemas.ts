import { z } from "zod";

export const zNavLink = z.object({ label: z.string(), href: z.string().url().or(z.string().startsWith("/")) });

export const zBrand = z.object({
  name: z.string().optional(),
  logo: z.object({
    src: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    alt: z.string().optional()
  }).optional(),
  favicon: z.object({
    src: z.string()
  }).optional()
});

export const zDesignTokens = z.object({
  brand: zBrand.optional(),
  colors: z.object({
    primary: z.string(),
    accent: z.string(),
    bg: z.string(),
    muted: z.string(),
  }),
  typography: z.object({ headline: z.string(), body: z.string() }),
});

export const zFooterNav = z.object({
    columns: z.array(z.object({
        title: z.string(),
        links: z.array(zNavLink),
    }))
});

export const zNavigation = z.object({
  header: z.array(zNavLink),
  footer: zFooterNav,
});

export const zMedia = z.object({
    src: z.string(),
    alt: z.string(),
    hint: z.string().optional(),
});

export const zRichText = z.array(
  z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
  ])
);

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


export const zHome = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    cta: zNavLink,
    image: zMedia,
  }),
  intro: z.object({
    title: z.string(),
    text: z.string(),
    image: zMedia,
  }),
  servicesHeading: z.string().optional(),
  services: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
    })
  ),
  cases: z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        href: z.string(),
        image: zMedia,
    })
  )
});

const zSeo = z.object({
    title: z.string(),
    description: z.string(),
});

export const zAboutPage = z.object({
    title: z.string(),
    subtitle: z.string(),
    content: z.object({
        body: zRichText,
    }),
    seo: zSeo,
});

export const zServicesPage = z.object({
    title: z.string(),
    subtitle: z.string(),
    content: z.object({
        services: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            bullets: z.array(z.string()),
        })),
    }),
    seo: zSeo,
});

export const zCasesIndexPage = z.object({
    title: z.string(),
    subtitle: z.string(),
    seo: zSeo,
});

export const zContactPage = z.object({
    title: z.string(),
    subtitle: z.string(),
    seo: zSeo,
});
