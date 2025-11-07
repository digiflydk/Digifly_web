
import { NextRequest, NextResponse } from 'next/server';
import { getCmsData } from '@/lib/cms-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const json = (data: any, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = (params.slug ?? []).join('/');

  if (path === 'site') {
      return json({ ok: false, error: 'HANDLED_BY_SPECIFIC_ROUTE' }, 404);
  }

  try {
    const data = await getCmsData(path, req.nextUrl.searchParams);
    if (data === null) {
      return json({ ok: false, error: 'NOT_FOUND' }, 404);
    }
    return json(data);
  } catch (error: any) {
    console.error(`[CMS] Error fetching data for ${path}:`, error);
    return json({ ok: false, error: 'SERVER_ERROR', detail: error.message }, 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug?: string[] } }) {
    const path = (params.slug ?? []).join('/');
    if (path === 'site') {
      return json({ ok: false, error: 'HANDLED_BY_SPECIFIC_ROUTE' }, 404);
    }
    return json({ ok: false, error: 'NOT_FOUND' }, 404);
}
