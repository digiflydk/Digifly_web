
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText } from "lucide-react";
import Link from "next/link";
import { getBaseUrl } from "@/lib/utils/baseUrl";

export const dynamic = "force-dynamic";

type DocFile = {
  slug: string;
  file: string;
};

async function getIndex(): Promise<{ files: DocFile[] }> {
    const baseUrl = getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/docs/list`, { cache: "no-store" });
      if (!res.ok) return { files: [] };
      return res.json();
    } catch {
      return { files: [] };
    }
}


export default async function DeveloperDocsPage() {
  const { files } = await getIndex();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Developer — Docs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Project documentation stored in <code>/docs</code>.
        </p>
      </div>


      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild variant="outline">
            <Link href="/api/docs/download?file=bundle.md">
                <Download className="h-4 w-4 mr-2" /> Download Bundle (.md)
            </Link>
        </Button>
        <Button asChild variant="outline">
            <Link href="/api/docs/download?file=debug.json">
                 <FileJson className="h-4 w-4 mr-2" /> Download Debug (.json)
            </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-lg border">
        {files.length === 0 ? (
          <p className="text-sm p-8 text-center text-muted-foreground">
            No files found. Add markdown files to <code>/docs</code>.
          </p>
        ) : (
          <ul className="divide-y">
            {files.map((f) => (
              <li key={f.slug} className="flex justify-between items-center p-4 hover:bg-slate-50">
                <span className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{f.file}</span>
                </span>
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/api/docs/download?file=${f.slug}.md`}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
