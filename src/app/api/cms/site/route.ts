
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

type SitePayload = {
  siteTitle: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  defaultDescription: string;
};

const COL = 'config';
const DOC = 'site';

export async function GET() {
  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.collection(COL).doc(DOC).get();
    const site = snap.exists
      ? snap.data()
      : { 
          siteTitle: "Digifly",
          tagline: "Strategy, Software & Automation with AI.",
          logoUrl: "", 
          faviconUrl: "", 
          defaultDescription: "" 
        };
    return NextResponse.json({ ok: true, site });
  } catch (error: any) {
    console.error(`[API GET /api/cms/site]`, error);
    return NextResponse.json({ ok: false, error: "Could not connect to database.", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let data: Partial<SitePayload>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const db = getFirestore(getAdminApp());
    // Ensure we only write the fields we expect.
    const payloadToSave = {
      siteTitle: data.siteTitle ?? "Digifly",
      tagline: data.tagline ?? "",
      logoUrl: data.logoUrl ?? "",
      faviconUrl: data.faviconUrl ?? "",
      defaultDescription: data.defaultDescription ?? "",
      updatedAt: Date.now()
    };
    
    await db.collection(COL).doc(DOC).set(payloadToSave, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(`[API POST /api/cms/site]`, error);
    return NextResponse.json({ ok: false, error: "Could not save to database.", details: error.message }, { status: 500 });
  }
}
