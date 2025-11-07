import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms-server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getSiteSettings();
    return NextResponse.json({ ok: true, data: data ?? {} });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Failed to load site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const saved = await saveSiteSettings(body);
    return NextResponse.json({ ok: true, data: saved });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Failed to save site settings" },
      { status: 400 }
    );
  }
}
