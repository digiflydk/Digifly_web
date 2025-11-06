
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

type SitePayload = {
  siteTitle?: string,
  tagline?: string,
  logoUrl?: string,
  faviconUrl?: string,
  defaultDescription?: string
};

const COL = 'content';
const DOC = 'site';

export async function GET() {
  const db = getFirestore(getAdminApp());
  const snap = await db.collection(COL).doc(DOC).get();
  const site = snap.exists
    ? snap.data()
    : { siteTitle: '', tagline: '', logoUrl: '', faviconUrl: '', defaultDescription: '' };
  return NextResponse.json({ ok: true, site });
}

export async function POST(req: Request) {
  let data: SitePayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const db = getFirestore(getAdminApp());
  
  // Create a new object with only the allowed fields.
  const payloadToSave: SitePayload = {
    siteTitle: data.siteTitle ?? '',
    tagline: data.tagline ?? '',
    logoUrl: data.logoUrl ?? '',
    faviconUrl: data.faviconUrl ?? '',
    defaultDescription: data.defaultDescription ?? '',
  };
  
  await db.collection(COL).doc(DOC).set({ ...payloadToSave, updatedAt: Date.now() }, { merge: true });
  
  return NextResponse.json({ ok: true });
}
