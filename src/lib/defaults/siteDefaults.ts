
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
