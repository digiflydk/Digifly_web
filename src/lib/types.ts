
export type { SiteSettings, HomePage, CaseDoc, Navigation, HeroSlide } from "./schemas";
export { SiteSettingsSchema, HomepageSchema, CaseSchema, NavigationSchema, BrandSchema, HeroSlideSchema } from "./schemas";

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
