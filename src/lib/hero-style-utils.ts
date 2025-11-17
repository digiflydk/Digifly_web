
"use client";

import type { HeroSlide } from "@/lib/types";
import { cmykToRgba } from "@/lib/utils";

// This helper is safe for server or client.
// It maps CMS data to frontend view model properties.

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

  const textColor = slide.textColor || '#FFFFFF';
  
  return {
    overlayColor,
    textColor,
    shouldRenderOverlay,
  };
}
