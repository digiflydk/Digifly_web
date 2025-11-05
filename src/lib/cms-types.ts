export type Media = { src: string; alt?: string; hint?: string };

export type Brand = {
  name?: string;
  logo?: {
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
  colors: {
    primary: string;
    electricBlue: string;
    digitalPurple: string;
    graphiteGrey: string;
    platinumGrey: string;
    softWhite: string;
    success: string;
    error: string;
  };
  typography: {
    headlineFont: string;
    bodyFont: string;
    h1: number;
    h2: number;
    h3: number;
    body: number;
    caption: number;
    lineHeight: number;
  };
  buttons: {
    shape: 'pill';
    radius: number;
    primary: { bg: string; text: string; hoverBg: string };
    secondary: { border: string; text: string; hoverBg: string };
    ghost: { text: string; hoverBg: string };
  };
  brand?: Brand;
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

export type CaseDoc = {
  slug: string;
  title: string;
  summary?: string;
  cover: Media;
  body?: RichTextContent[];
  metrics?: { label: string; value: string }[];
  seo: { title: string; description: string; image?: string };
  updatedAt?: number;
};

export type Page<T> = {
  title: string;
  subtitle?: string;
  content: T;
  seo: { title: string; description: string; image?: string };
};
