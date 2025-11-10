
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DOCS_DIR = path.join(process.cwd(), "docs");

// Security: Create an allow-list of known safe filenames from the docs directory.
function getSafeFileList(): string[] {
    if (!fs.existsSync(DOCS_DIR)) {
        return [];
    }
    const files = fs.readdirSync(DOCS_DIR);
    return files.filter(f => f.toLowerCase().endsWith(".md"));
}

function createMarkdownBundle(): string {
  const files = getSafeFileList().sort();
  if (files.length === 0) {
    return "# No documentation files found in /docs directory.\n";
  }
  const parts = files.map((f) => {
    const p = path.join(DOCS_DIR, f);
    const c = fs.readFileSync(p, "utf8");
    return `\n\n---\n\n# ${f}\n\n${c}\n`;
  });
  return `# Documentation Bundle\n\nGenerated: ${new Date().toISOString()}\n${parts.join("")}`;
}

function createDebugJson(): string {
  const files = getSafeFileList();
  const fileMeta = files.map((f) => {
      const st = fs.statSync(path.join(DOCS_DIR, f));
      return {
        file: f,
        bytes: st.size,
        mtime: st.mtime.toISOString(),
      };
    });
  return JSON.stringify({ files: fileMeta, total: fileMeta.length, generatedAt: new Date().toISOString() }, null, 2);
}


export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileParam = url.searchParams.get("file");

  if (!fileParam) {
    return NextResponse.json({ error: "File parameter is required" }, { status: 400 });
  }

  // --- Special Handlers ---
  if (fileParam === 'bundle.md') {
      const bundleContent = createMarkdownBundle();
      return new NextResponse(bundleContent, {
          headers: {
              "Content-Type": "text/markdown; charset=utf-8",
              "Content-Disposition": `attachment; filename="documentation-bundle.md"`
          }
      });
  }

  if (fileParam === 'debug.json') {
      const debugContent = createDebugJson();
      return new NextResponse(debugContent, {
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Content-Disposition": `attachment; filename="docs-debug.json"`
          }
      });
  }

  // --- Single File Download ---
  const safeFiles = getSafeFileList();
  const requestedFile = fileParam.endsWith('.md') ? fileParam : `${fileParam}.md`;
  
  if (!safeFiles.includes(requestedFile)) {
      return NextResponse.json({ error: "File not found or not allowed." }, { status: 404 });
  }

  const filePath = path.join(DOCS_DIR, requestedFile);

  try {
    const data = fs.readFileSync(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${requestedFile}"`
      }
    });
  } catch (error) {
    console.error(`Failed to read file: ${fileParam}`, error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
