import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import JSZip from 'jszip';

export const dynamic = 'force-dynamic';

// Security: Whitelist of allowed directories to prevent path traversal
const ALLOWED_DIRS = ['docs', 'public/media'];

function isPathSafe(filePath: string): boolean {
    const resolvedPath = path.resolve(filePath);
    return ALLOWED_DIRS.some(dir => {
        const allowedDir = path.resolve(dir);
        return resolvedPath.startsWith(allowedDir);
    });
}

function getFilesRecursively(dir: string, baseDir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getFilesRecursively(fullPath, baseDir));
        } else if (entry.name.endsWith('.md')) {
            files.push(path.relative(baseDir, fullPath));
        }
    }
    return files;
}

async function createMdBundle(): Promise<Buffer> {
    const docsDir = path.join(process.cwd(), "docs");
    const zip = new JSZip();
    
    if (fs.existsSync(docsDir)) {
        const mdFiles = getFilesRecursively(docsDir, docsDir);
        for (const file of mdFiles) {
            const filePath = path.join(docsDir, file);
            if(isPathSafe(filePath)) {
                const data = fs.readFileSync(filePath);
                zip.file(file, data);
            }
        }
    }
    return zip.generateAsync({ type: "nodebuffer" });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileParam = url.searchParams.get("file");

  if (!fileParam) {
    return NextResponse.json({ error: "File parameter is required" }, { status: 400 });
  }

  // Handle bundle downloads
  if (fileParam === 'all-md') {
      const buffer = await createMdBundle();
      return new NextResponse(buffer, {
          headers: {
              "Content-Type": "application/zip",
              "Content-Disposition": `attachment; filename="digifly-docs-md.zip"`
          }
      });
  }
  
  if (fileParam.includes("..") || path.isAbsolute(fileParam)) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const requestedDir = fileParam.startsWith('media/') ? 'public' : 'docs';
  const filePath = path.join(process.cwd(), requestedDir, fileParam.replace(/^media\//, ''));

  if (!isPathSafe(filePath)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const data = fs.readFileSync(filePath);
    const contentType = fileParam.endsWith(".md") ? "text/markdown" : (fileParam.endsWith(".json") ? "application/json" : "application/octet-stream");
    
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${path.basename(fileParam)}"`
      }
    });
  } catch (error) {
    console.error(`Failed to read file: ${fileParam}`, error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
