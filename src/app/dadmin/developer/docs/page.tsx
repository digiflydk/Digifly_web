
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { CheckCircle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Data Fetching & Types ---

type FileInfo = {
  name: string;
  relPath: string;
  bytes: number;
  mtime: string;
};

type ScanResult = {
  found: FileInfo[];
  allPaths: Set<string>;
};

const CANONICAL_DOCS = [
  "README.md",
  "FILE-MAP.md",
  "OPERATIONS-LOG.md",
  "PM-KICKOFF-TEMPLATE.md",
  "PM-ONEPAGER.md",
  "TROUBLESHOOTING-QUICK.md",
  "api-overview.md",
  "architecture.md",
  "data-flow.md",
  "data-communication.md",
  "firestore-collections-overview.md",
  "firestore-schema.md",
  "performance-indexes.md",
  "security-rbac.md",
];

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

// --- Page Component ---

export default function DeveloperDocsPage() {
  const docsDir = path.join(process.cwd(), "docs");
  const scanResult = recursiveScan(docsDir, docsDir);

  const canonicalFound = new Set(scanResult.found.map(f => f.name));
  const otherDocs = scanResult.found.filter(f => !CANONICAL_DOCS.includes(f.name));

  const renderTable = (title: string, files: (FileInfo | { name: string; missing: true })[]) => (
    <div>
      <h2 className="text-lg font-semibold mt-6 mb-3">{title}</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="[&>*]:px-4 [&>*]:py-3 text-left">
              <th>Name</th>
              <th>Status</th>
              <th>Size</th>
              <th>Modified</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((item) => {
              if ('missing' in item) {
                return (
                  <tr key={item.name} className="border-t text-muted-foreground opacity-60">
                    <td className="px-4 py-3 font-mono">{item.name}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-2"><XCircle className="h-4 w-4" /> Missing</span></td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3 text-right">—</td>
                  </tr>
                );
              }
              return (
                <tr key={item.relPath} className="border-t">
                  <td className="px-4 py-3 font-mono font-medium">{item.name}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-2 text-green-600"><CheckCircle className="h-4 w-4" /> Found</span></td>
                  <td className="px-4 py-3">{(item.bytes / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3">{new Date(item.mtime).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="outline" size="sm">
                       <a href={`/dadmin/developer/docs?download=file&path=${encodeURIComponent(item.relPath)}`} download={item.name}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </a>
                    </Button>
                  </td>
                </tr>
              );
            })}
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

      <div className="flex gap-3">
        <Button asChild>
          <a href="/dadmin/developer/docs?download=bundle">
            <Download className="h-4 w-4 mr-2" /> Download Bundle (.md)
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/dadmin/developer/docs?download=debug">Download Debug (.json)</a>
        </Button>
      </div>

      {scanResult.found.length === 0 && !fs.existsSync(docsDir) ? (
        <div className="text-sm text-center py-12 border rounded-lg bg-muted/50">
          The <code>/docs</code> directory does not exist.
        </div>
      ) : (
        <>
          {renderTable("Canonical Docs", CANONICAL_DOCS.map(name =>
            canonicalFound.has(name)
              ? scanResult.found.find(f => f.name === name)!
              : { name, missing: true }
          ))}
          {otherDocs.length > 0 && renderTable("Other Docs Found", otherDocs)}
        </>
      )}
    </div>
  );
}


// --- API Handlers for Downloads ---

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("download");

  if (!mode) {
    // This allows the default page component to render if no query param is present.
    return NextResponse.next();
  }

  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) {
      return new NextResponse("Not Found: /docs directory does not exist.", { status: 404 });
  }
  
  const scanResult = recursiveScan(docsDir, docsDir);

  if (mode === "debug") {
    const missingCanonical = CANONICAL_DOCS.filter(name => !scanResult.found.some(f => f.name === name));
    const debugData = {
        scannedFolders: Array.from(scanResult.allPaths).filter(p => !p.endsWith('.md')),
        totalFound: scanResult.found.length,
        missingCanonical,
        files: scanResult.found,
    };
    return NextResponse.json(debugData, { headers: { "Content-Type": "application/json; charset=utf-8" } });
  }
  
  if (mode === "bundle") {
    const bundleContent = "# Documentation Bundle\n\n" + scanResult.found
      .sort((a,b) => a.relPath.localeCompare(b.relPath))
      .map(f => {
        const content = fs.readFileSync(path.join(docsDir, f.relPath), "utf8");
        return `\n---\n\n# ${f.relPath}\n\n${content}\n`;
      }).join("");

    return new NextResponse(bundleContent, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="documentation-bundle.md"',
      },
    });
  }
  
  if (mode === "file") {
    const relPath = url.searchParams.get("path");
    if (!relPath) {
      return new NextResponse("Bad Request: 'path' parameter is required.", { status: 400 });
    }
    
    // Security: Ensure the resolved path is within the docsDir
    const fullPath = path.resolve(docsDir, relPath);
    if (!fullPath.startsWith(path.resolve(docsDir))) {
        return new NextResponse("Forbidden: Path traversal attempt detected.", { status: 403 });
    }

    if (!fs.existsSync(fullPath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const content = fs.readFileSync(fullPath, "utf8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${path.basename(relPath)}"`,
      },
    });
  }

  return new NextResponse("Bad Request: Invalid 'download' mode.", { status: 400 });
}
