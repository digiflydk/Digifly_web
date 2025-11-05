import { NextResponse, type NextRequest } from 'next/server';
import { getCmsData } from '@/lib/cms-server';

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
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(data, { headers: cacheHeaders() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad Request' }, { status: 400 });
  }
}
