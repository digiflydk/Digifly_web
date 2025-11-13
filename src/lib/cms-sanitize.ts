
import { CmsLinkSchema } from "./schemas";
import type { CmsLink, HomePage } from "./types";
import deepmerge from "deepmerge";
import { defaultHomepage } from "./defaults/siteDefaults";
import { HomepageSchema } from "./schemas";
import { zodErrorToIssues } from "./zod-helpers";

export function normalizeLink(raw: any): CmsLink {
  const type = raw?.type === "external" ? "external" : "internal";
  return {
    type,
    label: raw?.label ?? "",
    internalRef: type === "internal" ? raw?.internalRef ?? null : null,
    externalUrl: type === "external" ? raw?.externalUrl ?? "" : "",
    newTab: raw?.newTab ?? false,
  };
}

export function normalizeCta(raw: any): { label: string; link: CmsLink } {
    const label = raw?.label ?? "";
    const link = normalizeLink(raw?.link ?? {});
    return { label, link };
}


/**
 * Ensure homepage payload is complete and Zod-safe.
 */
export function sanitizeHomepage(input: Partial<HomePage> | undefined | null): HomePage {
  const merged = deepmerge(defaultHomepage, (input ?? {}) as object) as HomePage;

  // Hero slides → ensure CTA + link shape
  if (merged.hero && Array.isArray(merged.hero.slides)) {
    merged.hero.slides = merged.hero.slides.map((s: any) => {
      // If there's no label for a CTA, treat the whole CTA as null/undefined
      if (!s.cta || !s.cta.label) {
          return { ...s, cta: null };
      }
      return { ...s, cta: normalizeLink(s?.cta) };
    });
  } else {
    merged.hero = defaultHomepage.hero;
  }
  

  // WhatWeDo → ensure image + CTA exists
  merged.whatWeDo = merged.whatWeDo ?? ({} as any);
  if (merged.whatWeDo) {
    merged.whatWeDo.image = merged.whatWeDo.image ?? { src: '', alt: ''};
    merged.whatWeDo.cta = normalizeLink(merged.whatWeDo?.cta);
  }

  // Services → ensure each item has link shape
  if (merged.services && Array.isArray(merged.services.items)) {
    merged.services.items = (merged.services.items ?? []).map((it: any) => ({
      ...it,
      link: normalizeLink(it?.link),
    }));
  } else {
    merged.services = defaultHomepage.services;
  }

  // Final CTA
  if (merged.cta) {
    merged.cta.button = normalizeLink(merged.cta.button);
  }

  const result = HomepageSchema.safeParse(merged);

  if (!result.success) {
    console.warn(
      "[Client/Server] [sanitizeHomepage] Final object has validation issues. This may cause downstream errors.",
      JSON.stringify(zodErrorToIssues(result.error), null, 2)
    );
  }
  
  return merged;
}
