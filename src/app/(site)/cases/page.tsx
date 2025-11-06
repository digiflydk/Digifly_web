import { getCases, getCasesIndexPage } from "@/lib/cms";
import CasesGrid from "@/components/sections/cases-grid";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCasesIndexPage();
  if (!page) {
    return metaDefaults({
      title: "Case Studies • Digifly",
      description: "Our work in action.",
    });
  }
  return metaDefaults({
    title: page.seo.title,
    description: page.seo.description,
  });
}

export default async function CasesPage() {
    const page = await getCasesIndexPage();
    
    if (!page) {
        return (
            <Container className="py-16 text-center">
                <SectionHeading title="Our Work" subtitle="Case studies are being updated. Please check back soon." />
            </Container>
        );
    }
    
    return (
        <>
            <CasesGrid 
                title={page.title}
                subtitle={page.subtitle}
            />
        </>
    )
}
