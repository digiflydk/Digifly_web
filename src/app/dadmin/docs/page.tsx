
import { DocsList } from "@/components/docs/DocsList";
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, FileJson } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Developer Docs',
    description: 'Project documentation and technical files.',
    noIndex: true,
  });
}

const DUMPS = [
  {
    title: "CMS API Dump",
    description: "A JSON list of all registered CMS and admin-facing API endpoints.",
    href: "/api/developer/cms-api-dump",
    filename: "cms-api-dump.json",
  },
  {
    title: "DB Structure Dump",
    description: "A JSON overview of the Firestore collection and subcollection structure.",
    href: "/api/developer/db-structure",
    filename: "db-structure-dump.json",
  },
  {
    title: "DB Paths Dump",
    description: "A JSON map of all Firestore paths used in the codebase and where they are used.",
    href: "/api/developer/db-paths",
    filename: "db-paths-dump.json",
  },
];

export default function DeveloperDocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Developer — Dumps</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Download live-generated JSON overviews of the application's structure.
        </p>
         <div className="mt-4 grid gap-4 md:grid-cols-2">
            {DUMPS.map(dump => (
                <div key={dump.href} className="border rounded-xl p-4 flex flex-col justify-between items-start gap-4">
                    <div>
                        <h2 className="font-semibold">{dump.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{dump.description}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={dump.href} download={dump.filename}>
                            <FileJson className="h-4 w-4 mr-2" />
                            Download {dump.filename}
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
      </div>
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
