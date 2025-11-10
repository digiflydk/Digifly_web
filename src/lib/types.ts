

export type { HomePage, CaseDoc, Navigation, HeroSlide } from "./schemas";
export { SiteSettingsSchema, HomepageSchema, CaseSchema, NavigationSchema, BrandSchema } from "./schemas";
import { z } from "zod";

export type SiteSettings = {
  siteTitle: string;
  social: { tagline: string };
  defaultSeo: { title?: string; description?: string; defaultThumbnailUrl?: string };
  brand: {
    name: string;
    logo: { src: string; alt: string; height?: number; width?: number };
    favicon: { src: string };
  };
};

export type Media = { src: string; alt?: string; hint?: string };

export type Brand = {
    name: string;
    logo: {
      src: string;
      alt: string;
      height?: number;
      width?: number;
    };
    favicon: {
      src: string;
    };
};

export type DesignSettings = {
    // ...
};

export type NavLink = { label: string; href: string };

export type RichTextContent =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] };


export type Page<T> = {
    slug: string;
    title: string;
    subtitle?: string;
    content: T;
    seo: {
      title: string;
      description: string;
      image?: string;
    };
};
