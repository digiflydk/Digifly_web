import { getCases, getCasesIndexPage } from "@/lib/cms";
import CasesGrid from "@/components/sections/cases-grid";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { CasesIndexSchema } from "@/lib/schemas";
import { safeStr } from "@/lib/safe";

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
    
    return (
        <>
            <CasesGrid 
                title={page.title}
                subtitle={page.subtitle ?? ""}
            />
        </>
    )
}
