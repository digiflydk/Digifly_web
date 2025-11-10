

import { DocsList } from "@/components/docs/DocsList";
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Developer Docs',
    description: 'Project documentation and technical files.',
    noIndex: true,
  });
}

export default function DeveloperDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Developer — Docs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Project documentation stored in the <code>/docs</code> directory. Files are read-only.
        </p>
      </div>
      <DocsList />
    </div>
  );
}
