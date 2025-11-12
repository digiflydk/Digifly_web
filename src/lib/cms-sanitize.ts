
// src/lib/cms-sanitize.ts
import { CmsLinkSchema } from "./schemas";
import type { CmsLink, HomePage } from "./types";
import deepmerge from "deepmerge";
import { defaultHomepage } from "./defaults/siteDefaults";

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
 * This is a synchronous function and should not be in a "use server" file.
 */
export function sanitizeHomepage(input: Partial<HomePage> | undefined): HomePage {
  const merged = deepmerge(defaultHomepage, (input ?? {}) as object) as HomePage;

  // Hero slides → ensure CTA + link shape
  merged.hero = merged.hero ?? { slides: [], rotationDelaySec: 5 };
  merged.hero.slides = (merged.hero.slides ?? []).map((s: any) => ({
    ...s,
    cta: normalizeCta(s?.cta),
  }));

  // WhatWeDo → ensure image + CTA exists
  merged.whatWeDo = merged.whatWeDo ?? ({} as any);
  merged.whatWeDo.image = merged.whatWeDo.image ?? { src: '', alt: ''};
  merged.whatWeDo.cta = normalizeCta(merged.whatWeDo?.cta);

  // Services → ensure each item has link shape
  merged.services = merged.services ?? ({} as any);
  merged.services.items = (merged.services.items ?? []).map((it: any) => ({
    ...it,
    link: normalizeLink(it?.link),
  }));

  // Final CTA
  merged.cta = merged.cta ?? { text: '', button: { type: 'internal', label: '', internalRef: null }};
  merged.cta.button = normalizeLink(merged.cta.button);

  return merged;
}
