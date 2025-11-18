
"use client";

import type { HeroSlide } from "@/lib/types";
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
  overlayColor: string;
  textColor: string;
  shouldRenderOverlay: boolean;
};

export function mapHeroSlideToViewModel(slide: HeroSlide): HeroViewModel {
  const overlayEnabled = slide.overlay?.enabled ?? true;
  const cmyk = slide.overlay?.cmyk ?? { c: 0, m: 0, y: 0, k: 80 };
  const opacity = (slide.overlay?.opacityPercent ?? 60) / 100;
  
  const overlayColor = cmykToRgba(cmyk.c, cmyk.m, cmyk.y, cmyk.k, opacity);
  
  const shouldRenderOverlay = overlayEnabled !== false;

  const textColor = getHeroTextColorFromSlide(slide);
  
  return {
    overlayColor,
    textColor,
    shouldRenderOverlay,
  };
}
