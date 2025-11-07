
import type { SiteSettings, HomePage, HeroSlide } from '@/lib/types';
import { HeroSlideSchema } from '../schemas';

export const SITE_DEFAULTS: SiteSettings = {
  siteTitle: 'Digifly',
  brand: {
    name: 'Digifly',
    logo: { src: '', alt: 'Digifly Logo', width: 140, height: 28 },
    favicon: { src: '/favicon.ico' }
  },
  social: { 
    tagline: 'Strategy, Software & Automation with AI.'
  },
  defaultSeo: {
    description: "Digifly builds intelligent digital solutions.",
    title: ''
  }
} as const;


// DGF-109: New normalizer for safely handling image objects
export type Img = { src: string; alt?: string; width?: number; height?: number };

export const safeImage = (img?: Partial<Img> | null): Img => ({
  src: (img?.src ?? '').toString(),
  alt: img?.alt ?? '',
  width: img?.width ?? undefined,
  height: img?.height ?? undefined,
});

export const defaultHeroSlide: HeroSlide = {
  image: { src: "", alt: "" },
  heading: "New Slide",
  subheading: "A compelling subtitle for your new slide.",
  body: "",
  cta: { label: "Learn More", href: "/" },
  visible: true,
};

export const defaultHomepage: HomePage = {
  hero: { 
    slides: [
      {
        image: { src: "/media/hero-1.jpg", alt: "Abstract hero image" },
        heading: "From Idea to Intelligent Solution",
        subheading: "Digifly bridges strategy, technology and AI to build digital solutions that deliver measurable results.",
        body: "",
        cta: { label: "Start Your Project", href: "/contact" },
        visible: true,
      }
    ],
    rotationDelaySec: 5 
  },
  intro: { heading: "", body: "", image: { src: "", alt: "" } },
  servicesPreview: [],
  featuredCases: [],
  cta: {
    text: "Let's build something intelligent together.",
    button: { label: 'Book a Call', href: '/contact' }
  },
  seo: {
    title: 'Digifly Homepage',
    description: 'Default homepage description.'
  }
};


// DGF-125 Fix: Central normalization function
export function normalizeHome(data: any): Partial<HomePage> {
    if (!data || typeof data !== 'object') {
        return defaultHomepage;
    }

    const d = { ...defaultHomepage, ...data };
    
    // Ensure hero object and slides array exist
    d.hero = { ...defaultHomepage.hero, ...(d.hero || {}) };
    d.hero.slides = Array.isArray(d.hero.slides) ? d.hero.slides : [];

    // Normalize rotation delay
    const n = Number(d.hero.rotationDelaySec);
    if (![3, 5, 8, 10, 15].includes(n)) {
        d.hero.rotationDelaySec = 5;
    } else {
        d.hero.rotationDelaySec = n;
    }
    
    // Ensure other top-level fields are at least present
    d.intro = { ...defaultHomepage.intro, ...(d.intro || {}) };
    d.servicesPreview = Array.isArray(d.servicesPreview) ? d.servicesPreview : [];
    d.featuredCases = Array.isArray(d.featuredCases) ? d.featuredCases : [];
    d.cta = { ...defaultHomepage.cta, ...(d.cta || {}) };
    d.seo = { ...defaultHomepage.seo, ...(d.seo || {}) };

    return d;
}
