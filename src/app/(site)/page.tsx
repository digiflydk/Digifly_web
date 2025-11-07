
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
import { ZodError } from 'zod';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomePage();
    const site = await getSiteSettings();

    const seoTitle = safeStr(page?.seo?.title, safeStr(site.defaultSeo?.title, site.siteTitle));
    const seoDesc = safeStr(page?.seo?.description, site.defaultSeo?.description);
    
    return metaDefaults({
      title: seoTitle,
      description: seoDesc,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Homepage metadata validation failed:", error.format());
    }
    return metaDefaults({
      title: 'Error Loading Page',
      description: 'Could not load homepage content due to invalid data.',
    });
  }
}

export default async function HomePage() {
  let page;
  try {
    page = await getHomePage();
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && error instanceof ZodError) {
      return (
        <Container className="py-16 text-center">
            <SectionHeading 
                title="Homepage Validation Error" 
                subtitle="The content from the CMS is invalid. Check the server console for details." 
            />
             <pre className="mt-4 text-left bg-slate-100 p-4 rounded-md text-xs overflow-auto max-w-4xl mx-auto">
                {JSON.stringify(error.issues, null, 2)}
             </pre>
        </Container>
      );
    }
    // In production, or for non-Zod errors, you might want to render a more generic error
    // or fallback content. Here we re-throw to let Next.js handle it.
    throw error;
  }
  
  if (!page) {
    return (
      <Container className="py-16 text-center">
          <SectionHeading 
              title="Content Not Found" 
              subtitle="The homepage content could not be loaded from the CMS." 
          />
      </Container>
    );
  }

  // Final check with parse to ensure type safety, though getHomePage should have already validated
  const validatedPage = HomepageSchema.parse(page);

  return (
    <>
      <Hero data={validatedPage.hero} />
      {validatedPage.intro && <IntroWhyHowWhat data={validatedPage.intro} />}
      {validatedPage.servicesPreview && validatedPage.servicesPreview.length > 0 && <ServicesOverview items={validatedPage.servicesPreview} />}
      <CasesGrid 
        ids={validatedPage.featuredCases}
        title="Our Work in Action"
        subtitle="See how we translate complex problems into elegant, effective solutions."
        showAllLink
      />
      {validatedPage.cta && validatedPage.cta.button?.href && (
        <CtaBanner text={validatedPage.cta.text} button={validatedPage.cta.button} />
      )}
    </>
  );
}
