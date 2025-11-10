
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

type FileItem = { file: string; bytes: number; mtime: string };

function readDocs(): FileItem[] {
  const dir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort()
    .map((file) => {
      const st = fs.statSync(path.join(dir, file));
      return { file, bytes: st.size, mtime: st.mtime.toISOString() };
    });
}

// Handler for page rendering
export default function DeveloperDocsPage() {
  const files = readDocs();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Developer — Docs</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Files are read from <code>/docs</code> in the repository.
      </p>

      <div className="mt-4 flex gap-3">
        <a
          href="/dadmin/developer/docs?download=bundle"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm"
        >
          Download bundle (.md)
        </a>
        <a
          href="/dadmin/developer/docs?download=debug"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm"
        >
          Download debug (JSON)
        </a>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        {files.length === 0 ? (
          <p className="text-sm">
            No files found. Add markdown files to <code>/docs</code>.
          </p>
        ) : (
          <ul className="list-disc pl-6">
            {files.map((f) => (
              <li key={f.file} className="my-1">
                <span className="mr-3">{f.file}</span>
                <a
                  className="text-primary underline"
                  href={`/dadmin/developer/docs?download=file&name=${encodeURIComponent(
                    f.file
                  )}`}
                >
                  Download
                </a>
                <span className="ml-3 text-xs text-muted-foreground">
                  {f.bytes} bytes • {new Date(f.mtime).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Handler for download requests within the same route file
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("download");

  // If no download param, Next.js will render the default component.
  // If there is a download param, we handle it here.
  if (!mode) {
    return NextResponse.next();
  }

  const dir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(dir))
    return new NextResponse("docs folder not found", { status: 404 });

  if (mode === "debug") {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .map((f) => {
        const st = fs.statSync(path.join(dir, f));
        return { file: f, bytes: st.size, mtime: st.mtime.toISOString() };
      });
    return new NextResponse(JSON.stringify({ files, total: files.length }, null, 2), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (mode === "bundle") {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .sort();
    const bundle =
      "# Documentation bundle\n" +
      files
        .map((f) => `\n\n---\n# ${f}\n\n${fs.readFileSync(path.join(dir, f), "utf8")}`)
        .join("");
    return new NextResponse(bundle, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="documentation-bundle.md"',
      },
    });
  }

  if (mode === "file") {
    const name = new URL(req.url).searchParams.get("name") || "";
    // Basic sanitization to prevent path traversal
    const safe = name.replace(/[^A-Za-z0-9._-]/g, "");
    const filePath = path.join(dir, safe);

    if (!safe.endsWith(".md") || !fs.existsSync(filePath) || path.dirname(filePath) !== dir) {
      return new NextResponse("Not found or invalid file.", { status: 404 });
    }
    
    return new NextResponse(fs.readFileSync(filePath, "utf8"), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safe}"`,
      },
    });
  }

  return new NextResponse("Bad request", { status: 400 });
}
