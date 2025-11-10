import { DocsList } from "@/components/docs/DocsList";
import { buildSeo } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Developer Documentation',
    description: 'Project documentation and technical files.',
    noIndex: true,
  });
}

export default function DocsPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-xl font-semibold">Developer Documentation</h1>
            <p className="text-sm text-muted-foreground mt-1">
                Core project documentation files. Downloads are served via a secure API endpoint.
            </p>
        </div>
        <DocsList />
    </div>
  );
}
