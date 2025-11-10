
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
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .map((f) => ({
        slug: f.replace(/\.md$/i, ""),
        file: f,
      }));
      
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to list doc files:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
