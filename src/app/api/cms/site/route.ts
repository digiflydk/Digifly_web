
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const json = (data: any, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' },
  });

const COL = 'config';
const DOC = 'site';

export async function GET() {
  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.collection(COL).doc(DOC).get();
    const site = snap.exists
      ? snap.data()
      : { siteTitle: '', tagline: '', logoUrl: '', faviconUrl: '', defaultDescription: '' };
    return json({ ok: true, site });
  } catch (e: any) {
    console.error('[GET /api/cms/site]', e);
    return json({ ok: false, error: 'SERVER_ERROR', detail: String(e?.message ?? e) }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ ok: false, error: 'INVALID_JSON' }, 400);

    const { siteTitle, tagline, logoUrl, faviconUrl, defaultDescription } = body as any;

    const db = getFirestore(getAdminApp());
    await db.collection(COL).doc(DOC).set(
      {
        siteTitle: siteTitle ?? '',
        tagline: tagline ?? '',
        logoUrl: logoUrl ?? '',
        faviconUrl: faviconUrl ?? '',
        defaultDescription: defaultDescription ?? '',
        updatedAt: Date.now(),
      },
      { merge: true }
    );
    return json({ ok: true });
  } catch (e: any) {
    console.error('[POST /api/cms/site]', e);
    return json({ ok: false, error: 'SERVER_ERROR', detail: String(e?.message ?? e) }, 500);
  }
}
