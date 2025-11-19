

import { getHomepage, getSiteSettings } from '@/lib/cms';
import Hero from '@/components/sections/hero';
import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { Container } from '@/components/layout/container';
import type { HomePage, HeroSlide } from '@/lib/schemas';
import { WhatWeDo } from '@/components/sections/WhatWeDo';
import { Services } from '@/components/sections/Services';
import { defaultHomepage } from '@/lib/defaults/siteDefaults';
import CasesGrid from '@/components/sections/cases-grid';
import CtaBanner from '@/components/sections/cta-banner';
import { logHomepageHeroSnapshot } from '@/lib/dadmin/audit';
import { resolveCmsLink } from '@/lib/links';
import { mapHeroSlideToViewModel } from '@/lib/hero-style-utils';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const [pageResult, siteSettings] = await Promise.all([getHomepage(), getSiteSettings()]);
    const page = pageResult?.ok ? pageResult.data : defaultHomepage;
    
    return buildSeo({
      title: page?.seo?.title,
      description: page?.seo?.description,
    }, siteSettings);
}


export default async function HomePage() {
  const pageResult = await getHomepage().catch(() => ({ ok: false, data: defaultHomepage }));
  const page: HomePage = pageResult?.ok ? pageResult.data : defaultHomepage;
  
  // DGF-474: Map the first slide to the view model the Hero component expects
  const firstSlide = page.hero?.slides?.[0];
  const heroViewModel = firstSlide ? mapHeroSlideToViewModel(firstSlide) : null;

  if (heroViewModel) {
      // DGF-473: Log the view model data that will be rendered
      logHomepageHeroSnapshot({
          source: 'homepage-view-model',
          environment: process.env.NODE_ENV ?? 'unknown',
          hero: {
            heading: heroViewModel.heading,
            body: heroViewModel.body,
            textColor: heroViewModel.textColor,
            imageUrl: heroViewModel.imageUrl,
            imageAlt: heroViewModel.imageAlt,
            ctaLabel: heroViewModel.cta?.label ?? null,
            ctaHref: heroViewModel.cta ? resolveCmsLink(heroViewModel.cta).href : null,
            overlayEnabled: heroViewModel.overlayEnabled,
            overlayCmyk: heroViewModel.overlayCmyk,
            overlayOpacityPercent: heroViewModel.overlayOpacityPercent,
          },
      }).catch(err => console.warn('Failed to log homepage hero snapshot', err));
  }


  if (!page) {
    return (
        <Container className="py-16 text-center">
            <SectionHeading 
                title="Content Not Found" 
                subtitle="The homepage content could not be loaded. Please check the CMS." 
            />
        </Container>
    )
  }

  return (
    <>
      <Hero data={heroViewModel} />
      
      {page.whatWeDo?.enabled !== false && page.whatWeDo && (
        <WhatWeDo data={page.whatWeDo} />
      )}

      {page.services?.enabled !== false && page.services && (
        <Services data={page.services} />
      )}

      {page.featuredCases && page.featuredCases.length > 0 && (
        <CasesGrid 
            ids={page.featuredCases}
            title="Our Work in Action"
            subtitle="See how we translate complex problems into elegant, effective solutions."
            showAllLink
        />
      )}
      {page.cta?.button?.label && (
        <CtaBanner text={page.cta.text} button={page.cta.button} />
      )}
    </>
  );
}
