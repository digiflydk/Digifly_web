export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms/site";

const bad = (msg: string, status = 400) =>
  NextResponse.json({ ok: false, error: msg }, { status });

export async function GET() {
  const site = await getSiteSettings();
  return NextResponse.json({ ok: true, data: site });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return bad("Invalid JSON body", 400); }
  await saveSiteSettings(body);
  return NextResponse.json({ ok: true });
}
