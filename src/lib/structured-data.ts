
import type { SiteSettings } from "@/lib/schemas";

export function orgJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.general.title,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: settings.general.logoUrl,
  };
}

export function localBusinessJsonLd(settings: SiteSettings) {
  const c = settings.contact;
  if (!c?.street || !c?.city) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.general.title,
    telephone: c.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.street,
      postalCode: c.zip,
      addressLocality: c.city,
      addressCountry: c.country || "DK",
    },
    openingHoursSpecification: toOpeningHours(settings),
  };
}

function toOpeningHours(s: SiteSettings) {
  const map: Record<string,string> = {
    sunday:"Sunday", monday:"Monday", tuesday:"Tuesday",
    wednesday:"Wednesday", thursday:"Thursday",
    friday:"Friday", saturday:"Saturday",
  };
  return Object.entries(s.openingHours).flatMap(([k,v]) => {
    if (!v.open || !v.from || !v.to) return [];
    return [{ "@type":"OpeningHoursSpecification", dayOfWeek: map[k], opens: v.from, closes: v.to }];
  });
}
