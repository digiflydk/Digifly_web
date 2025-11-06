
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { getCaseCount } from "@/lib/cms";
import { StatCard } from "./_components/StatCard";

export function generateMetadata(): Metadata {
    return metaDefaults({
      title: 'CMS Dashboard',
      description: 'Manage site content.',
    });
}

// Dummy functions to satisfy dashboard
async function getPages(opts: {limit: number}) { return { count: 4 }; }
async function getNavigationMenuCount() { return { count: 2 }; }

export default async function DadminPage() {
    const [{ count: caseCount }, { count: pageCount }, { count: menuCount }] = await Promise.all([
      getCaseCount(),
      getPages({ limit: 0 }),
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
