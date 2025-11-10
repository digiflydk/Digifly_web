
import type { SiteSettings } from "@/lib/schemas";

export function orgJsonLd(settings: SiteSettings) {
  if (!settings?.general?.title) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.general.title,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: settings.general.logoUrl,
  };
}

type DaySpec = { enabled: boolean; from?: string; to?: string };
type HoursRecord = Record<string, DaySpec | undefined>;

function toOpeningHours(hours?: HoursRecord) {
  if (!hours || typeof hours !== "object") return [];
  
  const out: any[] = [];
  const dayMap: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  for (const [key, spec] of Object.entries(hours)) {
    const dayOfWeek = dayMap[key];
    if (dayOfWeek && spec?.enabled && spec.from && spec.to) {
      out.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayOfWeek,
        opens: spec.from,
        closes: spec.to,
      });
    }
  }
  return out;
}

export function localBusinessJsonLd(settings: SiteSettings) {
  const c = settings.contact;
  if (!c?.street || !c?.city || !settings.general?.title) return null;

  const opening = toOpeningHours(settings.hours ?? undefined);

  const jsonLd: any = {
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
    logo: settings.general.logoUrl,
    url: process.env.NEXT_PUBLIC_SITE_URL,
  };
  
  if (opening.length > 0) {
      jsonLd.openingHoursSpecification = opening;
  }

  return jsonLd;
}
