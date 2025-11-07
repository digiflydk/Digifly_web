
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";

const COLLECTION = "site";
const DOC = "settings";

const json = (data: any, status: number = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function GET() {
  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.collection(COLLECTION).doc(DOC).get();
    const site = snap.exists ? snap.data() : {};
    return json({ ok: true, site });
  } catch (e: any) {
    console.error(`[GET /api/cms/site]`, e);
    return json({ ok: false, error: "SERVER_ERROR", detail: e.message }, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ ok: false, error: "INVALID_JSON" }, 400);

    const parsed = SiteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return json({ ok: false, error: "VALIDATION_ERROR", detail: parsed.error.issues }, 422);
    }
    
    const db = getFirestore(getAdminApp());
    await db.collection(COLLECTION).doc(DOC).set(parsed.data, { merge: true });
    
    return json({ ok: true });
  } catch (e: any) {
    console.error(`[PUT /api/cms/site]`, e);
    return json({ ok: false, error: "SERVER_ERROR", detail: e.message }, 500);
  }
}
