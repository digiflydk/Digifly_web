
import { z } from "zod";
import { CaseSchema } from "./schemas";


export type Media = { src: string; alt?: string; hint?: string };

export type Brand = {
  name?: string;
  logo: {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  favicon?: {
    src: string;
  };
};

export type DesignSettings = {
  brand?: Brand;
  colors: {
    primary: string;
    accent: string;
    bg: string;
    muted: string;
  };
  typography: {
    headline: string;
    body: string;
  };
};

export type NavLink = { label: string; href: string };

export type Navigation = {
  header: NavLink[];
  footer: {
    columns: {
        title: string;
        links: NavLink[];
    }[];
  };
};

export type HomePage = {
  hero: { title: string; subtitle: string; primaryCta: NavLink; image?: Media };
  intro: {
    tagline: string;
    heading: string;
    body: string;
    image?: Media;
  };
  servicesPreview: {
    title: string;
    bullets: string[];
    href: string;
  }[];
  featuredCases: string[];
  cta: { text: string; button: NavLink };
  seo: { title: string; description: string };
};

export type RichTextContent =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] };

export type CaseDoc = z.infer<typeof CaseSchema>;

export type Page<T> = {
  title: string;
  subtitle?: string;
  content: T;
  seo: { title: string; description: string; image?: string };
}
