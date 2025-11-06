import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms/site";
import { getCmsData } from "@/lib/cms-server";

type Params = { params: { slug?: string[] } };

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: NextRequest, { params }: Params) {
  const path = (params?.slug || []).join('/');
  
  if (path === "site") {
    const site = await getSiteSettings();
    return NextResponse.json({ ok: true, data: site });
  }

  // Fallback to original logic for other paths
  const { searchParams } = new URL(req.url);
  try {
    const data = await getCmsData(path, searchParams);
    if (data === null && path !== 'health') {
      return jsonError(`Unknown path: /api/cms/${path || ""}`, 404);
    }
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return jsonError(e?.message || 'Bad Request');
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const seg = params.slug?.join("/") ?? "";
  if (seg !== "site") return jsonError(`Unknown path: /api/cms/${seg || ""}`, 404);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  try {
    await saveSiteSettings(body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Failed to save site settings:", e);
    return jsonError("Failed to save settings.", 500);
  }
}
