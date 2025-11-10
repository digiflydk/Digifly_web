
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getSiteSeo, saveSiteSeo } from '@/lib/dadmin/siteSeoRepo';
import { SiteSettingsSchema } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) => NextResponse.json(data, { status });

export async function GET() {
  try {
    const data = await getSiteSeo();
    return json({ ok: true, data });
  } catch (e: any) {
    return json({ ok: false, error: e.message || 'Server error' }, 500);
  }
}

export async function PUT(req: Request) {
  // TODO: Add admin auth check
  try {
    const body = await req.json();
    const parsedData = SiteSettingsSchema.parse(body);
    await saveSiteSeo(parsedData);
    return json({ ok: true });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return json({ ok: false, error: 'Validation failed', issues: e.issues }, 400);
    }
    return json({ ok: false, error: e.message || 'Server error' }, 500);
  }
}
