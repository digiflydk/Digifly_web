
import { getCases } from "@/lib/cms-api";
import CasesGrid from "@/components/sections/cases-grid";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { CasesIndexSchema } from "@/lib/schemas";
import { safeStr } from "@/lib/safe";
import { getCasesIndexPage } from "@/lib/cms-server";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const rawPage = await getCasesIndexPage();
  const page = CasesIndexSchema.parse(rawPage || {});

  return metaDefaults({
    title: safeStr(page.seo.title, page.title),
    description: safeStr(page.seo.description, page.subtitle),
  });
}

export default async function CasesPage() {
    const rawPage = await getCasesIndexPage();
    const page = CasesIndexSchema.parse(rawPage || {});
    
    // This now calls the isomorphic getCases from cms-api
    const allCases = await getCases({ published: true });

    if (allCases.length === 0) {
        return (
            <Container className="py-16 text-center">
                <SectionHeading 
                    title="No cases yet" 
                    subtitle="Check back soon to see our latest work." 
                />
            </Container>
        )
    }
    
    return (
        <CasesGrid 
            title={page.title}
            subtitle={safeStr(page.subtitle)}
        />
    )
}
