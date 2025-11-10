

import type { SiteSettings } from "@/lib/schemas";

type DaySpec = { day: string; opens: string; closes: string };
type HoursRecord = Record<string, { enabled?: boolean; from?: string; to?: string } | undefined>;


type OpeningHoursSpec = {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string;
  opens: string;
  closes: string;
};

// Null-safe helper to generate opening hours array
function toOpeningHours(hours?: HoursRecord | null): OpeningHoursSpec[] {
  if (!hours || typeof hours !== 'object') {
    return [];
  }
  
  const out: OpeningHoursSpec[] = [];
  const dayMap: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  for (const [key, spec] of Object.entries(hours)) {
    const dayOfWeek = dayMap[key];
    if (dayOfWeek && spec?.enabled && spec.from && spec.to) {
      out.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayOfWeek,
        opens: spec.from,
        closes: spec.to,
      });
    }
  }
  return out;
}

export function orgJsonLd(settings?: SiteSettings | null) {
  if (!settings?.general?.brandName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.general.brandName,
    url: settings.seo?.canonicalBase || process.env.NEXT_PUBLIC_SITE_URL,
    logo: settings.general.logoUrl,
  };
}

export function localBusinessJsonLd(settings?: SiteSettings | null) {
  const c = settings?.contact;
  if (!c?.street || !c?.city || !settings?.general?.brandName) return null;

  const opening = toOpeningHours(settings.hours);

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.general.brandName,
    telephone: c.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.street,
      postalCode: c.zip,
      addressLocality: c.city,
      addressCountry: c.country || "DK",
    },
    logo: settings.general.logoUrl,
    url: settings.seo?.canonicalBase || process.env.NEXT_PUBLIC_SITE_URL,
  };
  
  if (opening.length > 0) {
      jsonLd.openingHoursSpecification = opening;
  }

  return jsonLd;
}
