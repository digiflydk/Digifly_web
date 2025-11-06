import { NextResponse, type NextRequest } from 'next/server';
import { getCmsData, saveSiteSettings } from '@/lib/cms-server';
import { z } from 'zod';
import { SiteSettingsSchema } from '@/lib/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function cacheHeaders() {
  return { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };
}

// Using `ctx: any` to bypass strict Next.js type validation that can fail in some versions.
export async function GET(req: NextRequest, ctx: any) {
  const path = (ctx?.params?.slug || []).join('/');
  const { searchParams } = new URL(req.url);

  try {
    const data = await getCmsData(path, searchParams);
    if (data === null) {
      return NextResponse.json({ ok: false, error: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data }, { headers: cacheHeaders() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Bad Request' }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug?: string[] }}) {
  const path = (params.slug || []).join('/');

  if (path === "site") {
      let body: any;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
      }
      
      try {
        const parsedData = SiteSettingsSchema.parse(body);
        await saveSiteSettings(parsedData);
        return NextResponse.json({ ok: true });
      } catch (error: any) {
        console.error(`[api/cms/site] Save Error:`, error);
        if (error instanceof z.ZodError) {
          return NextResponse.json({ ok: false, error: "Invalid data provided.", details: error.flatten() }, { status: 400 });
        }
        return NextResponse.json({ ok: false, error: 'Failed to save site settings.' }, { status: 500 });
      }
  }

  return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
}
