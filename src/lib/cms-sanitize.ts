
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
export function sanitizeHomepage(input: Partial<HomePage> | undefined | null): HomePage {
  // Start with a deep merge to fill in missing nested objects and properties from defaults.
  const merged = deepmerge(defaultHomepage, (input ?? {}) as object) as HomePage;

  // DGF-362: Enforce array lengths to prevent "inflation".
  // Take the first item from Firestore data if it exists, otherwise use the default.
  if (merged.hero?.slides && merged.hero.slides.length > 0) {
    merged.hero.slides = [merged.hero.slides[0]];
  } else {
    merged.hero.slides = [defaultHeroSlide];
  }

  // Take up to 3 services.
  if (merged.services?.items) {
    merged.services.items = merged.services.items.slice(0, 3);
  }

  // Take up to 3 featured cases.
  if (merged.featuredCases) {
    merged.featuredCases = merged.featuredCases.slice(0, 3);
  }
  
  // Sanitize nested CmsLink objects within the structure
  if (merged.hero?.slides[0]?.cta) {
    merged.hero.slides[0].cta = normalizeLink(merged.hero.slides[0].cta);
  }

  if (merged.whatWeDo?.cta) {
    merged.whatWeDo.cta = normalizeLink(merged.whatWeDo.cta);
  }

  if (merged.services?.items) {
    merged.services.items = merged.services.items.map(it => ({ ...it, link: normalizeLink(it.link) }));
  }

  if (merged.cta?.button) {
    merged.cta.button = normalizeLink(merged.cta.button);
  }

  const result = HomepageSchema.safeParse(merged);

  if (!result.success) {
    console.warn(
      "[Client/Server] [sanitizeHomepage] Final object has validation issues. This may cause downstream errors.",
      JSON.stringify(zodErrorToIssues(result.error), null, 2)
    );
    // Return the merged data anyway, it's the most complete version we have.
    return merged;
  }
  
  // Return the fully validated and parsed data if successful.
  return result.data;
}
