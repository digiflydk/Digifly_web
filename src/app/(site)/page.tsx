
import { getHomepage, getSiteSettings } from '@/lib/cms-server';
import Hero from '@/components/sections/hero';
import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { Container } from '@/components/layout/container';
import type { HomePage } from '@/lib/schemas';
import { WhatWeDo } from '@/components/sections/WhatWeDo';
import { Services } from '@/components/sections/Services';
import { defaultHomepage } from '@/lib/defaults/siteDefaults';
import CasesGrid from '@/components/sections/cases-grid';
import CtaBanner from '@/components/sections/cta-banner';


export async function generateMetadata(): Promise<Metadata> {
    const [pageResult, siteSettings] = await Promise.all([getHomepage(), getSiteSettings()]);
    const page = pageResult.data as HomePage; 

    return buildSeo({
      title: page?.seo?.title,
      description: page?.seo?.description,
    }, siteSettings);
}


export default async function HomePage() {
  const result = await getHomepage();
  const page = result.data ?? defaultHomepage;

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
      <Hero data={page.hero} />
      
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
      {page.cta?.button?.link && (
        <CtaBanner text={page.cta.text} button={page.cta.button} />
      )}
    </>
  );
}
