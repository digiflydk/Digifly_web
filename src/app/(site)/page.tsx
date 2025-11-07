
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { ZodIssue } from 'zod';


export async function generateMetadata(): Promise<Metadata> {
    const result = await getHomePage();
    const site = await getSiteSettings();

    // Use sanitized data even if validation fails, it's safer
    const page = result.data; 

    const seoTitle = page?.seo?.title ? page.seo.title : site.siteTitle;
    const seoDesc = page?.seo?.description ? page.seo.description : site.defaultSeo?.description;
    
    return metaDefaults({
      title: seoTitle,
      description: seoDesc,
    });
}

const DevErrorDisplay = ({ issues }: { issues: ZodIssue[] }) => (
    <div className="fixed bottom-4 right-4 max-w-md w-full z-50">
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Homepage Validation Error (Dev only)</AlertTitle>
            <AlertDescription>
                <p>The content from the CMS is invalid. Page is rendering with safe fallbacks.</p>
                <pre className="mt-2 text-xs bg-black/10 p-2 rounded-md overflow-auto max-h-40">
                    {JSON.stringify(issues, null, 2)}
                </pre>
            </AlertDescription>
        </Alert>
    </div>
);

export default async function HomePage() {
  const result = await getHomePage();
  const page = result.data;

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
      {!result.ok && process.env.NODE_ENV === 'development' && (
          <DevErrorDisplay issues={result.issues} />
      )}
      <Hero data={page.hero} />
      {page.intro && <IntroWhyHowWhat data={page.intro} />}
      {page.servicesPreview && page.servicesPreview.length > 0 && <ServicesOverview items={page.servicesPreview} />}
      <CasesGrid 
        ids={page.featuredCases}
        title="Our Work in Action"
        subtitle="See how we translate complex problems into elegant, effective solutions."
        showAllLink
      />
      {page.cta?.button?.href && (
        <CtaBanner text={page.cta.text} button={page.cta.button} />
      )}
    </>
  );
}
