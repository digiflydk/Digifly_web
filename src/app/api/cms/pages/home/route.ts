

import { NextResponse } from 'next/server';
import { getCmsHomePayload } from '@/lib/server/cms-home-endpoint';
import { logHomepageHeroSnapshot } from '@/lib/dadmin/audit';
import type { HeroSlide } from '@/lib/types';
import { resolveCmsLink } from '@/lib/links';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getCmsHomePayload();
  
  // DGF-473: Log the hero data snapshot from the API route
  const firstSlide = payload.hero?.slides?.[0] as HeroSlide | undefined;
  if (firstSlide) {
      const { href: ctaHref } = resolveCmsLink(firstSlide.cta);
      const heroSnapshot = {
        heading: firstSlide.heading ?? null,
        body: firstSlide.body ?? null,
        textColor: firstSlide.textColor ?? null,
        imageUrl: firstSlide.image?.src ?? null,
        imageAlt: firstSlide.image?.alt ?? null,
        ctaLabel: firstSlide.cta?.label ?? null,
        ctaHref: ctaHref ?? null,
        overlayEnabled: !!firstSlide.overlay?.enabled,
        overlayCmyk: {
          c: firstSlide.overlay?.cmyk?.c ?? null,
          m: firstSlide.overlay?.cmyk?.m ?? null,
          y: firstSlide.overlay?.cmyk?.y ?? null,
          k: firstSlide.overlay?.cmyk?.k ?? null,
        },
        overlayOpacityPercent: firstSlide.overlay?.opacityPercent ?? null,
      };

      const environment = process.env.NODE_ENV ?? 'unknown';

      logHomepageHeroSnapshot({
        source: 'api-cms-home',
        environment,
        hero: heroSnapshot,
      }).catch(() => {});
  }

  return NextResponse.json(payload, { 
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=0, stale-while-revalidate=0'
    }
  });
}
