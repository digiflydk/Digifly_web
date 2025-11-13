
import type { SiteSettings } from "@/lib/types";

export const emptySiteSettings: SiteSettings = {
  general: { 
    brandName: "", 
    logoUrl: "", 
    faviconUrl: "" 
  },
  contact: { 
    email: "", 
    phone: "", 
    company: "", 
    street: "", 
    zip: "", 
    city: "", 
    country: "" 
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
    defaultTitle: "",
    defaultDescription: "",
    ogImage: "",
    canonicalBase: ""
  }
};


export const coerceToDefaults = (data: any): SiteSettings => {
  if (!data) return { ...emptySiteSettings };

  // Create a deep copy of defaults to avoid mutation
  const defaults = JSON.parse(JSON.stringify(emptySiteSettings));
  
  // Recursively merge data into defaults
  const merge = (target: any, source: any) => {
    for (const key in target) {
      if (source && typeof source[key] !== 'undefined') {
        if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  };

  merge(defaults, data);
  return defaults;
};
