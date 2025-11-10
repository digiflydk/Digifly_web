
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { CheckCircle, XCircle, Download, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// --- Data Fetching & Types ---

type FileItem = { name: string; relPath: string; bytes: number; mtime: string };
type MissingFileItem = { name: string; missing: true };
type CombinedFileItem = FileItem | MissingFileItem;

type ScanResult = {
  found: FileItem[];
  allPaths: Set<string>;
};

const CANONICAL_DOCS = [
  "README.md", "FILE-MAP.md", "OPERATIONS-LOG.md", "PM-KICKOFF-TEMPLATE.md",
  "PM-ONEPAGER.md", "TROUBLESHOOTING-QUICK.md", "api-overview.md",
  "architecture.md", "data-flow.md", "data-communication.md",
  "firestore-collections-overview.md", "firestore-schema.md",
  "performance-indexes.md", "security-rbac.md",
];

const DOCS_DIR = path.join(process.cwd(), "docs");

function recursiveScan(dir: string, baseDir: string): ScanResult {
  const result: ScanResult = { found: [], allPaths: new Set() };
  if (!fs.existsSync(dir)) return result;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);
    result.allPaths.add(relPath);

    if (entry.isDirectory()) {
      const subResult = recursiveScan(fullPath, baseDir);
      result.found.push(...subResult.found);
      subResult.allPaths.forEach(p => result.allPaths.add(p));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      const stats = fs.statSync(fullPath);
      result.found.push({
        name: entry.name,
        relPath: relPath,
        bytes: stats.size,
        mtime: stats.mtime.toISOString(),
      });
    }
  }
  return result;
}

// --- Page Component & Actions ---

export default function DeveloperDocsPage() {
  const scanResult = recursiveScan(DOCS_DIR, DOCS_DIR);
  const canonicalFound = new Set(scanResult.found.map(f => f.name));
  
  const canonicalItems: CombinedFileItem[] = CANONICAL_DOCS.map(name => {
      const foundFile = scanResult.found.find(f => f.name === name);
      return foundFile ? foundFile : { name, missing: true };
  });

  const otherDocs = scanResult.found.filter(f => !CANONICAL_DOCS.includes(f.name));

  async function createPlaceholder(formData: FormData) {
    "use server";
    const fileName = formData.get("fileName") as string;
    if (!fileName || !CANONICAL_DOCS.includes(fileName)) {
      console.error("[Docs] Invalid file creation attempt:", fileName);
      return;
    }
    try {
      if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
      }
      const filePath = path.join(DOCS_DIR, fileName);
      const content = `# ${fileName}\n\nDocumentation placeholder.\n`;
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`[Docs] Created placeholder file: ${fileName}`);
      revalidatePath("/dadmin/developer/docs");
    } catch (error) {
      console.error(`[Docs] Failed to create placeholder for ${fileName}:`, error);
    }
  }

  const renderTable = (title: string, files: CombinedFileItem[]) => (
    <div>
      <h2 className="text-lg font-semibold mt-6 mb-3">{title}</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="[&>*]:px-4 [&>*]:py-3 text-left">
              <th className="w-2/5">Name</th>
              <th>Status</th>
              <th>Size</th>
              <th>Modified</th>
              <th className="text-right w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((item) => (
              <tr key={item.name} className="border-t">
                <td className="px-4 py-3 font-mono font-medium">{item.name}</td>
                {'missing' in item ? (
                  <>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-red-600" title="File does not exist in /docs">
                        <XCircle className="h-4 w-4" /> Missing
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">—</td>
                    <td className="px-4 py-3 text-muted-foreground">—</td>
                    <td className="px-4 py-3 text-right">
                      <form action={createPlaceholder}>
                        <input type="hidden" name="fileName" value={item.name} />
                        <Button type="submit" variant="outline" size="sm">
                          <FilePlus className="h-4 w-4 mr-2" /> Create Placeholder
                        </Button>
                      </form>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-green-600" title="File exists in /docs">
                        <CheckCircle className="h-4 w-4" /> Found
                      </span>
                    </td>
                    <td className="px-4 py-3">{(item.bytes / 1024).toFixed(1)} KB</td>
                    <td className="px-4 py-3">{new Date(item.mtime).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                       <Button asChild variant="outline" size="sm">
                          <a href={`/api/docs/download?file=${encodeURIComponent(item.relPath)}`} download={item.name}>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </a>
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Developer Docs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live view of markdown files from the <code>/docs</code> directory.
        </p>
      </div>

       <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>About This Page</AlertTitle>
          <AlertDescription>
            &quot;Missing&quot; files are standard documentation templates expected in the <code>/docs</code> directory. You can create placeholders for them directly here.
          </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button asChild>
          <a href="/api/docs/download?file=bundle.md">
            <Download className="h-4 w-4 mr-2" /> Download Bundle (.md)
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/api/docs/download?file=debug.json">Download Debug (.json)</a>
        </Button>
      </div>

      {scanResult.found.length === 0 && !fs.existsSync(DOCS_DIR) ? (
        <div className="text-sm text-center py-12 border rounded-lg bg-muted/50">
          The <code>/docs</code> directory does not exist.
        </div>
      ) : (
        <>
          {renderTable("Canonical Docs", canonicalItems)}
          {otherDocs.length > 0 && renderTable("Other Docs Found", otherDocs)}
        </>
      )}
    </div>
  );
}
