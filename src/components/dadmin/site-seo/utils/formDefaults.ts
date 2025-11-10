
// src/components/dadmin/site-seo/utils/formDefaults.ts
import { SiteSettings } from "@/lib/schemas";
import { merge } from "lodash";

export const emptySiteSeo: SiteSettings = {
  general: {
    title: '',
    tagline: '',
    logoUrl: '',
    faviconUrl: '',
  },
  contact: {
    email: '',
    phone: '',
    company: '',
    street: '',
    zip: '',
    city: '',
    country: '',
  },
  hours: {
    sunday:   { enabled: false, from: '09:00', to: '17:00' },
    monday:   { enabled: true,  from: '09:00', to: '17:00' },
    tuesday:  { enabled: true,  from: '09:00', to: '17:00' },
    wednesday:{ enabled: true,  from: '09:00', to: '17:00' },
    thursday: { enabled: true,  from: '09:00', to: '17:00' },
    friday:   { enabled: true,  from: '09:00', to: '17:00' },
    saturday: { enabled: false, from: '09:00', to: '17:00' },
  },
  seo: {
    allowIndexing: true,
    defaultTitle: '',
    defaultDescription: '',
    ogImage: '',
  },
};

export const coerceToDefaults = (data: any): SiteSettings => {
  // Use lodash merge for deep merging, which doesn't overwrite objects with undefined
  return merge({}, emptySiteSeo, data);
};
