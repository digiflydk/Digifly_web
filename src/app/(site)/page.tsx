
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
import { HomepageSchema } from '@/lib/schemas';

export async function generateMetadata(): Promise<Metadata> {
  const rawPage = await getHomePage();
  const site = await getSiteSettings();

  const page = HomepageSchema.parse(rawPage || {});

  const seoTitle = safeStr(page.seo?.title, safeStr(site.defaultSeo?.title, site.siteTitle));
  const seoDesc = safeStr(page.seo?.description, site.defaultSeo?.description);
  
  return metaDefaults({
    title: seoTitle,
    description: seoDesc,
  });
}

export default async function HomePage() {
  const rawPage = await getHomePage();
  
  try {
    const page = HomepageSchema.parse(rawPage || {});

    return (
      <>
        <Hero data={page.hero} />
        {page.intro && <IntroWhyHowWhat data={page.intro} />}
        {page.servicesPreview && page.servicesPreview.length > 0 && <ServicesOverview items={page.servicesPreview} />}
        <CasesGrid 
          ids={page.featuredCases}
          title="Our Work in Action"
          subtitle="See how we translate complex problems into elegant, effective solutions."
          showAllLink
        />
        {page.cta && page.cta.button?.href && (
          <CtaBanner text={page.cta.text} button={page.cta.button} />
        )}
      </>
    );

  } catch (error) {
      if (error instanceof Error) {
        console.error("Homepage validation failed:", error.message);
      }
      return (
        <Container className="py-16 text-center">
            <SectionHeading 
                title="Something went wrong" 
                subtitle="Could not load homepage content from the CMS due to invalid data." 
            />
             {error instanceof Error && (
                <pre className="mt-4 text-left bg-slate-100 p-4 rounded-md text-xs overflow-auto">
                    {JSON.stringify(JSON.parse(error.message), null, 2)}
                </pre>
             )}
        </Container>
    );
  }
}
