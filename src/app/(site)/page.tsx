
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
import { ZodError, ZodIssue } from 'zod';

export async function generateMetadata(): Promise<Metadata> {
    const result = await getHomePage();
    const site = await getSiteSettings();

    // Use sanitized data even if validation fails, it's safer
    const page = result.data; 

    const seoTitle = safeStr(page?.seo?.title, safeStr(site.defaultSeo?.title, site.siteTitle));
    const seoDesc = safeStr(page?.seo?.description, site.defaultSeo?.description);
    
    return metaDefaults({
      title: seoTitle,
      description: seoDesc,
    });
}

const DevErrorDisplay = ({ issues }: { issues: ZodIssue[] }) => (
    <Container className="py-16 text-center">
        <SectionHeading 
            title="Homepage Validation Error" 
            subtitle="The content from the CMS is invalid. Check the server console for details." 
        />
         <pre className="mt-4 text-left bg-slate-100 p-4 rounded-md text-xs overflow-auto max-w-4xl mx-auto">
            {JSON.stringify(issues, null, 2)}
         </pre>
    </Container>
);

export default async function HomePage() {
  const result = await getHomePage();

  // In development, show a detailed error. In production, it renders the sanitized fallback.
  if (!result.ok && process.env.NODE_ENV === 'development') {
    return <DevErrorDisplay issues={result.issues} />;
  }
  
  // Use the data (either valid or sanitized) for rendering
  const page = result.data;

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
      {validatedPage.cta?.button?.href && (
        <CtaBanner text={validatedPage.cta.text} button={validatedPage.cta.button} />
      )}
    </>
  );
}
