
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { SiteSettingsSchema } from '@/lib/schemas';

const COL = 'site';
const DOC = 'settings';

function json(payload: any, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.collection(COL).doc(DOC).get();
    const data = snap.exists ? snap.data() : {};
    const site = SiteSettingsSchema.parse(data);
    return json({ ok: true, data: site });
  } catch (e: any) {
    console.error(`[GET /api/admin/site]`, e);
    return json({ ok: false, error: 'SERVER_ERROR', detail: e.message }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ ok: false, error: 'INVALID_JSON' }, 400);

    const parsedData = SiteSettingsSchema.parse(body);

    const db = getFirestore(getAdminApp());
    await db.collection(COL).doc(DOC).set(parsedData, { merge: true });
    
    return json({ ok: true, data: parsedData });
  } catch (e: any) {
    console.error(`[POST /api/admin/site]`, e);
     if (e instanceof Error && 'issues' in e) { // ZodError
      return json({ ok: false, error: 'VALIDATION_ERROR', detail: e.issues }, 422);
    }
    return json({ ok: false, error: 'SERVER_ERROR', detail: e.message }, 500);
  }
}
