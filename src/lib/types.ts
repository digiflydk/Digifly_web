

import { z } from "zod";
import { HomepageSchema, CaseSchema, DesignSettingsSchema, NavigationSchema, SiteSettingsSchema } from "./schemas";


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

export type DesignSettings = z.infer<typeof DesignSettingsSchema>;

export type NavLink = { label: string; href: string };

export type Navigation = z.infer<typeof NavigationSchema>;

export type HomePage = z.infer<typeof HomepageSchema>;

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

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
