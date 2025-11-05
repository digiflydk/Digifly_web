import { NextResponse } from 'next/server';
import { zDesignTokens, zNavigation, zHome } from '@/lib/cms-schemas';
import { getDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';           // ensure Node runtime
export const dynamic = 'force-dynamic';    // never prerender this route
export const revalidate = 0;               // no static caching at build

function cacheHeaders() {
  return { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };
}

export async function GET(_req: Request, { params }: { params: { slug?: string[] } }) {
  const path = (params.slug || []).join('/');

  // Lazy-grab Firestore ONLY inside the handler:
  const db = getDb();

  try {
    if (!path || path === 'health') {
      return NextResponse.json({ ok: true, ts: Date.now() }, { headers: cacheHeaders() });
    }

    if (path === 'design') {
      const snap = await db.doc('content/settings/design').get();
      const data = zDesignTokens.parse(snap.data());
      return NextResponse.json(data, { headers: cacheHeaders() });
    }

    if (path === 'navigation') {
      const snap = await db.doc('content/navigation').get();
      const data = zNavigation.parse(snap.data());
      return NextResponse.json(data, { headers: cacheHeaders() });
    }

    if (path === 'home') {
      const snap = await db.doc('content/home').get();
      const data = zHome.parse(snap.data());
      return NextResponse.json(data, { headers: cacheHeaders() });
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (e: any) {
    // Return 400 with a concise error; do not crash the build
    return NextResponse.json({ error: e?.message || 'Bad Request' }, { status: 400 });
  }
}
