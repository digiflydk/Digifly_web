
import type { SiteSettings } from '@/lib/types';

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
