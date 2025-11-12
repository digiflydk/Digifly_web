import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import JSZip from 'jszip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOCS_DIR = path.join(process.cwd(), "docs");

function getSafeFileList(): string[] {
    if (!fs.existsSync(DOCS_DIR)) {
        return [];
    }
    const files = fs.readdirSync(DOCS_DIR);
    return files.filter(f => /\.(md|json|txt|yaml|yml)$/i.test(f));
}

function createMarkdownBundle(): string {
  const files = getSafeFileList().filter(f => f.toLowerCase().endsWith('.md')).sort();
  if (files.length === 0) {
    return "# No markdown documentation files found in /docs directory.\n";
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

  if (fileParam === 'all-md.zip') {
      const zip = new JSZip();
      const mdFiles = getSafeFileList().filter(f => f.toLowerCase().endsWith('.md'));
      
      for (const file of mdFiles) {
          const filePath = path.join(DOCS_DIR, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          zip.file(file, content);
      }
      
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

      return new NextResponse(zipBuffer, {
          status: 200,
          headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="digifly-docs-md.zip"',
          },
      });
  }

  const safeFiles = getSafeFileList();
  const requestedFile = safeFiles.find(sf => sf === fileParam || sf.replace(/\.md$/i, '') === fileParam);
  
  if (!requestedFile) {
      return NextResponse.json({ error: "File not found or not allowed." }, { status: 404 });
  }

  const filePath = path.join(DOCS_DIR, requestedFile);

  try {
    const data = fs.readFileSync(filePath);
    const mimeType = requestedFile.endsWith('.md') ? 'text/markdown' : 'text/plain';
    return new NextResponse(data, {
      headers: {
        "Content-Type": `${mimeType}; charset=utf-8`,
        "Content-Disposition": `attachment; filename="${requestedFile}"`
      }
    });
  } catch (error) {
    console.error(`Failed to read file: ${fileParam}`, error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
