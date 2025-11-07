import { getHomePage, getSiteSettings } from '@/lib/cms';
import Hero from '@/components/sections/hero';
import ServicesOverview from '@/components/sections/services-overview';
import CasesGrid from '@/components/sections/cases-grid';
import CtaBanner from '@/components/sections/cta-banner';
import IntroWhyHowWhat from '@/components/sections/intro-why-how-what';
import { metaDefaults } from '@/lib/seo';
import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/section-heading';
import { Container } from '@/components/layout/container';
import { safeStr } from '@/lib/safe';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  const site = await getSiteSettings();

  const seoTitle = safeStr(page.seo?.title, safeStr(site.defaultSeo?.description, site.siteTitle));
  const seoDesc = safeStr(page.seo?.description, site.defaultSeo?.description);
  
  return metaDefaults({
    title: seoTitle,
    description: seoDesc,
  });
}

export default async function HomePage() {
  const page = await getHomePage();

  if (!page) {
    return (
        <Container className="py-16 text-center">
            <SectionHeading title="Content Not Found" subtitle="Could not load homepage content from the CMS." />
        </Container>
    );
  }


  return (
    <>
      <Hero data={page.hero} />
      <IntroWhyHowWhat data={page.intro} />
      <ServicesOverview items={page.servicesPreview} />
      <CasesGrid 
        ids={page.featuredCases}
        title="Our Work in Action"
        subtitle="See how we translate complex problems into elegant, effective solutions."
        showAllLink
      />
      {page.cta && (
        <CtaBanner text={page.cta.text} button={page.cta.button} />
      )}
    </>
  );
}
