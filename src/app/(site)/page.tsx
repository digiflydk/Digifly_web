import { getHomePage } from '@/lib/cms';
import Hero from '@/components/sections/hero';
import ServicesOverview from '@/components/sections/services-overview';
import CasesGrid from '@/components/sections/cases-grid';
import CtaBanner from '@/components/sections/cta-banner';
import IntroWhyHowWhat from '@/components/sections/intro-why-how-what';
import { metaDefaults } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  if (!page?.seo) {
    return metaDefaults({
      title: "Home",
      description: "Homepage for Digifly"
    });
  }
  return metaDefaults({
    title: page.seo.title,
    description: page.seo.description,
  });
}

export default async function HomePage() {
  const page = await getHomePage();

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
      <CtaBanner text={page.cta.text} button={page.cta.button} />
    </>
  );
}
