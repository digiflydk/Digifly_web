import { DocsList } from "@/components/docs/DocsList";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await metaDefaults({
    title: 'Documentation',
    description: 'Project documentation and technical files.',
  });
}

export default function DocsPage() {
  return (
    <main className="container mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-8">Documentation</h1>
      <DocsList />
    </main>
  );
}
