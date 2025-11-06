
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { SiteSettingsSchema } from '@/lib/schemas';

const COL = 'config';
const DOC = 'site';

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET() {
  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.collection(COL).doc(DOC).get();
    
    // Use the schema with defaults to ensure the object shape is always consistent.
    const site = SiteSettingsSchema.parse(snap.exists ? snap.data() : {});
    
    return json({ ok: true, site });
  } catch (e: any) {
    console.error('[CMS][GET /api/cms/site] ', e?.message ?? e);
    return json({ ok: false, error: 'SERVER_ERROR', detail: String(e?.message ?? e) }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ ok: false, error: 'INVALID_JSON' }, 400);

    // Validate the incoming data against the schema
    const parsed = SiteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return json({ ok: false, error: 'INVALID_PAYLOAD', detail: parsed.error.flatten() }, 400);
    }
    
    const db = getFirestore(getAdminApp());
    await db.collection(COL).doc(DOC).set(
      {
        ...parsed.data,
        updatedAt: Date.now(),
      },
      { merge: true },
    );
    return json({ ok: true });
  } catch (e: any) {
    console.error('[CMS][POST /api/cms/site] ', e?.message ?? e);
    return json({ ok: false, error: 'SERVER_ERROR', detail: String(e?.message ?? e) }, 500);
  }
}
