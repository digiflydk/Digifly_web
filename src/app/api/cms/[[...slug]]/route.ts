import { NextResponse, type NextRequest } from 'next/server';
import { getCmsData, getSiteSettings, saveSiteSettings } from '@/lib/cms-server';
import { z } from 'zod';
import { SiteSettingsSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function jsonError(message: string, status = 400) {
    return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = (params?.slug || []).join('/');
  const { searchParams } = new URL(req.url);

  if (path === 'site') {
    const site = await getSiteSettings();
    return NextResponse.json({ ok: true, data: site });
  }

  try {
    const data = await getCmsData(path, searchParams);
    if (data === null && path !== 'health') {
      return jsonError('Not Found', 404);
    }
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return jsonError(e?.message || 'Bad Request');
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug?: string[] }}) {
  const path = (params.slug || []).join('/');

  if (path === "site") {
      let body: any;
      try {
        body = await req.json();
      } catch {
        return jsonError("Invalid JSON body");
      }
      
      try {
        const parsedData = SiteSettingsSchema.parse(body);
        await saveSiteSettings(parsedData);
        return NextResponse.json({ ok: true });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return jsonError(error.flatten().fieldErrors.toString());
        }
        return jsonError('Failed to save site settings.', 500);
      }
  }

  return jsonError("Not found", 404);
}
