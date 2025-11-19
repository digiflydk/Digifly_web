
// src/lib/homepage-view-model.ts
import type { HeroSlide } from "@/lib/types";

/**
 * DGF-475:
 * Build a simple, server-safe view model of the first hero slide
 * that can be safely logged from the homepage server component.
 *
 * This helper must NOT import React or any client-only utilities.
 */
export function buildHeroViewModelForLogging(slide: HeroSlide) {
  return {
    heading: slide.heading ?? null,
    body: slide.body ?? null,
    textColor: slide.textColor ?? null,
    imageUrl: slide.image?.src ?? null,
    imageAlt: slide.image?.alt ?? null,
    ctaLabel: slide.cta?.label ?? null,
    ctaHref: resolveCmsLink(slide.cta).href ?? null,
    overlayEnabled: slide.overlay?.enabled ?? false,
    overlayCmyk: slide.overlay?.cmyk ?? null,
    overlayOpacityPercent: slide.overlay?.opacityPercent ?? null,
  };
}

// Minimal version of resolveCmsLink to avoid client-side dependencies
import { mapPageIdToPath } from './links';
import type { CmsLink } from './types';
function resolveCmsLink(link?: CmsLink | null) {
    if (!link) return {};
    if (link.type === 'internal' && link.internalRef) {
        return { href: mapPageIdToPath(link.internalRef) };
    }
    if (link.type === 'external' && link.externalUrl) {
        return { href: link.externalUrl };
    }
    return {};
}
