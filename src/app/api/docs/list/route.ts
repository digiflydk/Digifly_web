import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function getDocsInDir(dir: string, initialFiles: { name: string; type: 'markdown' | 'json'; url: string }[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getDocsInDir(fullPath, initialFiles);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".json")) {
      const name = path.relative(path.join(process.cwd()), fullPath).replace(/^docs[/\\]/, '');
      initialFiles.push({
        name,
        type: name.endsWith(".md") ? "markdown" : "json",
        url: `/api/docs/download?file=${encodeURIComponent(name)}`
      });
    }
  }
  return initialFiles;
}


export async function GET() {
  try {
    const docsDir = path.join(process.cwd(), "docs");
    if (!fs.existsSync(docsDir)) {
      return NextResponse.json({ files: [] });
    }
    const files = getDocsInDir(docsDir);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to list doc files:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
