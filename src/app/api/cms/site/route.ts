export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

const ok = (data: any) =>
  NextResponse.json({ ok: true, ...data }, { headers: { 'Cache-Control': 'no-store' } });
const fail = (error: string, status = 500, detail?: any) =>
  NextResponse.json({ ok: false, error, detail }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.collection('config').doc('site').get();
    const site = snap.exists
      ? snap.data()
      : { siteTitle: '', tagline: '', logoUrl: '', faviconUrl: '', defaultDescription: '' };
    return ok({ site });
  } catch (e: any) {
    console.error('[GET /api/cms/site]', e);
    return fail('SERVER_ERROR', 500, String(e?.message ?? e));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail('INVALID_JSON', 400);

    const { siteTitle, tagline, logoUrl, faviconUrl, defaultDescription } = body as any;

    const db = getFirestore(getAdminApp());
    await db.collection('config').doc('site').set(
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
    return ok({});
  } catch (e: any) {
    console.error('[POST /api/cms/site]', e);
    return fail('SERVER_ERROR', 500, String(e?.message ?? e));
  }
}
