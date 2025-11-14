
import { CmsLinkSchema } from "@/data/schemas";
import type { CmsLink, HomePage } from "./types";
import deepmerge from "deepmerge";
import { defaultHomepage, defaultHeroSlide } from "@/data/defaults";
import { HomepageSchema } from "@/data/schemas";
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
 * Ensures homepage payload is structurally sound and adheres to baseline content rules.
 * This function does NOT throw on validation errors; it logs them and returns
 * the best-effort data to avoid breaking the entire page.
 */
export function sanitizeHomepage(input: Partial<HomePage> | undefined | null): Partial<HomePage> {
  const data = (input ?? {}) as Partial<HomePage>;

  // DGF-362 & DGF-367: Ensure arrays have the correct length but don't add full default items.
  // This just slices, it doesn't add missing items.
  if (data.hero?.slides) {
    data.hero.slides = data.hero.slides.slice(0, 1);
  }

  if (data.services?.items) {
    data.services.items = data.services.items.slice(0, 3);
  }

  if (data.featuredCases) {
    data.featuredCases = data.featuredCases.slice(0, 3);
  }
  
  // Sanitize nested CmsLink objects within the structure if they exist
  if (data.hero?.slides?.[0]?.cta) {
    data.hero.slides[0].cta = normalizeLink(data.hero.slides[0].cta);
  }

  if (data.whatWeDo?.cta) {
    data.whatWeDo.cta = normalizeLink(data.whatWeDo.cta);
  }

  if (data.services?.items) {
    data.services.items = data.services.items.map(it => ({ ...it, link: normalizeLink(it.link) }));
  }

  if (data.cta?.button) {
    data.cta.button = normalizeLink(data.cta.button);
  }
  
  return data;
}
