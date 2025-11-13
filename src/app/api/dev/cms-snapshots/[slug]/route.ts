
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const SNAPSHOT_FILES: Record<string, string> = {
  "site-settings": "site-settings.json",
  "site-navigation": "site-navigation.json",
  "pages-home": "pages-home.json",
  // Add more mappings as needed
};

type RouteContext = {
  params: { slug: string };
};

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const slug = context.params.slug;
  const filename = SNAPSHOT_FILES[slug];

  if (!filename) {
    return new NextResponse("Snapshot not found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "DOCS",
    "snapshots",
    filename,
  );

  try {
    const content = await fs.readFile(filePath, "utf8");

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
        console.warn("Snapshot file not found on disk", { slug, filename, error });
        return new NextResponse(`Snapshot file not found. Please run 'npm run export:cms-snapshots' to generate it.`, { status: 404 });
    }
    console.error("Error reading snapshot", { slug, filename, error });
    return new NextResponse("Error reading snapshot file", { status: 500 });
  }
}
