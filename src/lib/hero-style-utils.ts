
"use client";

import type { HeroSlide, CmsLink } from "@/lib/types";
import { cmykToRgba } from "@/lib/utils";

const DEFAULT_HERO_TEXT_COLOR = '#ffffff';

export function getHeroTextColorFromSlide(slide: HeroSlide | null | undefined): string {
  if (!slide) return DEFAULT_HERO_TEXT_COLOR;

  // If CMS textColor is set, always prefer it
  if (slide.textColor && slide.textColor.trim().length > 0) {
    return slide.textColor;
  }

  // Otherwise fall back to the existing default behaviour
  return DEFAULT_HERO_TEXT_COLOR;
}

export type HeroViewModel = {
  heading: string;
  eyebrow: string | null;
  body: string | null;
  textColor: string;
  imageUrl: string | null;
  imageAlt: string | null;
  cta: CmsLink | null;
  overlayEnabled: boolean;
  overlayColor: string | null;
  // DGF-473: Pass raw values through for logging
  overlayCmyk: { c: number; m: number; y: number; k: number; };
  overlayOpacityPercent: number;
};

export function mapHeroSlideToViewModel(slide: HeroSlide): HeroViewModel {
    const overlay = slide.overlay ?? { enabled: true, cmyk: { c: 0, m: 0, y: 0, k: 80 }, opacityPercent: 60 };
    const overlayEnabled = overlay.enabled ?? true;
    const cmyk = overlay.cmyk ?? { c: 0, m: 0, y: 0, k: 80 };
    const opacity = (overlay.opacityPercent ?? 60) / 100;
  
    const overlayColor = cmykToRgba(cmyk.c, cmyk.m, cmyk.y, cmyk.k, opacity);
    
    return {
        heading: slide.heading ?? "",
        eyebrow: slide.eyebrow ?? null,
        body: slide.body ?? null,
        textColor: getHeroTextColorFromSlide(slide),
        imageUrl: slide.image?.src ?? null,
        imageAlt: slide.image?.alt ?? null,
        cta: slide.cta ?? null,
        overlayEnabled,
        overlayColor,
        // Pass raw values for logging
        overlayCmyk: cmyk,
        overlayOpacityPercent: opacity * 100,
    };
}
