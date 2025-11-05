import { getCases, getCasesIndexPage } from "@/lib/cms";
import CasesGrid from "@/components/sections/cases-grid";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCasesIndexPage();
  return metaDefaults({
    title: page.seo.title,
    description: page.seo.description,
  });
}

export default async function CasesPage() {
    const page = await getCasesIndexPage();
    const cases = await getCases();
    
    return (
        <>
            <CasesGrid 
                title={page.title}
                subtitle={page.subtitle}
            />
        </>
    )
}
