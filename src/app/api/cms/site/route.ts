
import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms-server";
import { SiteSettingsSchema } from "@/lib/schemas";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const json = (data: any, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });


export async function GET() {
  try {
    const data = await getSiteSettings();
    // getSiteSettings now guarantees a valid object, so no need to check for null
    return json({ ok: true, data });
  } catch (err: any) {
    console.error(`[GET /api/cms/site]`, err);
    return json({ ok: false, error: "SERVER_ERROR", detail: err.message }, 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsedData = SiteSettingsSchema.parse(body);
    const saved = await saveSiteSettings(parsedData);
    return json({ ok: true, data: saved });
  } catch (err: any) {
    if (err instanceof Error && 'issues' in err) { // ZodError
      return json({ ok: false, error: 'VALIDATION_ERROR', detail: err.issues }, 422);
    }
    console.error(`[PUT /api/cms/site]`, err);
    return json({ ok: false, error: err?.message ?? "Failed to save site settings" }, 400);
  }
}
