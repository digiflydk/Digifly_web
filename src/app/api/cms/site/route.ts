
import { NextResponse } from "next/server";
import { readSiteSettings, writeSiteSettings } from "@/lib/dadmin/siteSeoRepo";
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
    const data = await readSiteSettings();
    return json({ ok: true, data });
  } catch (err: any) {
    console.error(`[GET /api/cms/site]`, err);
    return json({ ok: false, error: { code: 'SERVER_ERROR', message: err.message } }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return json({ ok: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, 400);
    }
    // The form sends the data directly, not nested under a `data` key
    const parsedData = SiteSettingsSchema.parse(body);
    const saved = await writeSiteSettings(parsedData);
    return json({ ok: true, data: saved });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return json({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid data provided', issues: err.issues } }, 422);
    }
    console.error(`[POST /api/cms/site]`, err);
    return json({ ok: false, error: { code: 'SERVER_ERROR', message: err.message || 'Failed to save site settings' } }, 500);
  }
}
