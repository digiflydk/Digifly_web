

import { getHomepage, getSiteSettings } from '@/lib/cms-server';
import Hero from '@/components/sections/hero';
import ServicesOverview from '@/components/sections/services-overview';
import CasesGrid from '@/components/sections/cases-grid';
import CtaBanner from '@/components/sections/cta-banner';
import IntroWhyHowWhat from '@/components/sections/intro-why-how-what';
import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { Container } from '@/components/layout/container';
import type { HomePage } from '@/lib/schemas';


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
  const page = result.data as HomePage;

  // Final check to ensure we always have a valid page object to render
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
      {page.intro && <IntroWhyHowWhat data={page.intro} />}
      {page.servicesPreview && page.servicesPreview.length > 0 && <ServicesOverview items={page.servicesPreview} />}
      {page.featuredCases && page.featuredCases.length > 0 && (
        <CasesGrid 
            ids={page.featuredCases}
            title="Our Work in Action"
            subtitle="See how we translate complex problems into elegant, effective solutions."
            showAllLink
        />
      )}
      {page.cta?.button?.href && (
        <CtaBanner text={page.cta.text} button={page.cta.button} />
      )}
    </>
  );
}
