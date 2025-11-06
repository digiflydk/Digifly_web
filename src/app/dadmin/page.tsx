
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { getCaseCount, getPageCount, getNavigationMenuCount } from "@/lib/cms-server";
import { StatCard } from "./_components/StatCard";

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return metaDefaults({
      title: 'CMS Dashboard',
      description: 'Manage site content.',
    });
}

export default async function DadminPage() {
    const [{ count: caseCount }, { count: pageCount }, { count: menuCount }] = await Promise.all([
      getCaseCount(),
      getPageCount(),
      getNavigationMenuCount(),
    ]);

    return (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Case Studies" value={caseCount} href="/dadmin/cases" icon="Briefcase" cta="Manage cases" />
          <StatCard title="Pages" value={pageCount} href="/dadmin/pages" icon="Newspaper" cta="Manage pages" />
          <StatCard title="Navigation" value={menuCount} href="/dadmin/navigation" icon="Link2" cta="Manage menus" />
        </div>
    );
}
