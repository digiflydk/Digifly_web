
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const docsDir = path.join(process.cwd(), "docs");
    if (!fs.existsSync(docsDir)) {
      return NextResponse.json({ files: [] });
    }
    const files = fs.readdirSync(docsDir)
      .filter((f) => /\.(md|json|txt|yaml|yml)$/i.test(f))
      .map((f) => {
        const lower = f.toLowerCase();
        const type = lower.endsWith('.md') ? 'markdown' :
                     lower.endsWith('.json') ? 'json' :
                     'other';
        return {
          name: f,
          slug: f.replace(/\.(md|json|txt|yaml|yml)$/i, ""),
          type,
          url: `/api/docs/download?file=${encodeURIComponent(f)}`
        };
      });
      
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to list doc files:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
