
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const FILES: Record<string, string> = {
  "cms-homepage": "cms-homepage.json",
  "cms-navigation": "cms-navigation.json",
  "cms-site": "cms-site.json",
  "cms-footer": "cms-footer.json"
};

export async function GET(_: Request, context: { params: { slug: string } }) {
  const slug = context.params.slug;
  const filename = FILES[slug];

  if (!filename) {
    return new NextResponse("Snapshot not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "DOCS", "snapshots", filename);
    const content = await fs.readFile(filePath, "utf8");

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    console.error("Snapshot read error", { slug, filename, err });
    return new NextResponse("Error reading snapshot", { status: 500 });
  }
}
