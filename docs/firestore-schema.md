# Firestore Data Schemas

This document provides a detailed breakdown of the data structures used in Firestore, as defined by the Zod schemas in `src/data/schemas.ts`.

## 1. Site Settings (`site/settings`)

- **Schema**: `SiteSettingsSchema`
- **Description**: Global configuration for the entire site.

```typescript
{
  general: {
    brandName: string, // e.g., "Digifly"
    logoUrl: string,   // Full URL to the logo image
    faviconUrl: string // Full URL to the favicon
  },
  contact: {
    email: string,
    phone: string,
    company: string,
    street: string,
    zip: string,
    city: string,
    country: string
  },
  hours: {
    // Each day is an object, e.g., "monday":
    monday: { enabled: boolean, from: "HH:mm", to: "HH:mm" },
    // ... and so on for all 7 days
  },
  seo: {
    allowIndexing: boolean,      // If false, adds <meta name="robots" content="noindex">
    defaultTitle: string,        // Fallback SEO title
    defaultDescription: string,  // Fallback meta description
    ogImage: string,             // Fallback Open Graph image URL
    canonicalBase: string        // e.g., "https://www.digifly.app"
  }
}
```

## 2. Navigation (`site/navigation`)

- **Schema**: `NavigationSchema`
- **Description**: Defines the links for the header and footer menus.

```typescript
{
  header: NavLink[], // Array of navigation links for the main menu
  footer: {
    columns: {
      title: string,   // e.g., "Company"
      links: NavLink[] // Array of links for this footer column
    }[]
  }
}

// Sub-structure: NavLink
type NavLink = {
  id: string, // Unique ID for React keys
  link: CmsLink
};

// Sub-structure: CmsLink
type CmsLink = {
  type: "internal" | "external",
  label: string,
  internalRef: string | null, // Page ID (slug) for internal links
  externalUrl: string,        // Full URL for external links
  newTab: boolean
};
```

## 3. Homepage (`pages/home`)

- **Schema**: `HomepageSchema`
- **Description**: All content for the homepage sections.

```typescript
{
  hero: {
    rotationDelaySec: number,
    slides: HeroSlide[] // Array, but currently only the first slide is used
  },
  whatWeDo: {
    enabled: boolean,
    subtitle: string,
    title: string,
    body: string,
    image: { src: string, alt: string },
    cta: CmsLink
  },
  services: {
    enabled: boolean,
    subtitle: string,
    title: string,
    items: ServiceItem[]
  },
  featuredCases: string[], // Array of case study slugs
  cta: {
    text: string,
    button: CmsLink
  },
  seo: {
    title: string,
    description: string
  }
}

// Sub-structure: HeroSlide
type HeroSlide = {
  heading: string,
  body: string,
  eyebrow?: string,
  image: { src: string, alt: string },
  cta: CmsLink,
  visible: boolean,
  textColor?: string, // e.g., "#FFFFFF"
  overlay?: {
    enabled: boolean,
    cmyk: { c: number, m: number, y: number, k: number },
    opacityPercent: number
  }
};

// Sub-structure: ServiceItem
type ServiceItem = {
  icon?: string, // Lucide icon name
  title: string,
  body: string,
  link: CmsLink
};
```

## 4. Case Study (`cases/{caseId}`)

- **Schema**: `CaseSchema`
- **Description**: Content for an individual case study.

```typescript
{
  id?: string, // Firestore document ID
  slug: string, // Unique URL slug
  title: string,
  published: boolean,
  excerpt: string,
  content: string, // HTML or Markdown content
  cover: { src: string, alt: string },
  seo: {
    title?: string,
    description?: string,
    image?: string
  }
}
```
