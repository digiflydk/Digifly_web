
import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms-server";
import { SiteSettingsSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const json = (payload: any, status = 200) =>
  NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });

export async function GET() {
  try {
    const data = await getSiteSettings();
    if (!data) {
        return json({ ok: false, error: 'not_found' }, 404);
    }
    return json({ ok: true, data });
  } catch (err: any) {
    console.error(`[GET /api/cms/site]`, err);
    return json({ ok: false, error: "SERVER_ERROR", detail: err.message }, 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return json({ ok: false, error: 'INVALID_JSON' }, 400);
    }
    const parsedData = SiteSettingsSchema.parse(body);
    const saved = await saveSiteSettings(parsedData);
    return json({ ok: true, data: saved });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return json({ ok: false, error: 'VALIDATION_ERROR', details: err.issues }, 422);
    }
    console.error(`[PUT /api/cms/site]`, err);
    return json({ ok: false, error: "Failed to save site settings" }, 400);
  }
}
