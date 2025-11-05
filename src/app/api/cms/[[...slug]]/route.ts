import { NextResponse } from 'next/server';
import { getCmsData } from '@/lib/cms-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function cacheHeaders() {
  return { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };
}

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  const path = (params.slug || []).join('/');
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
