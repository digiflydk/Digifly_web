
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { SiteSettingsSchema } from "@/lib/schemas";

const DOC_PATH = "settings/site-seo";

async function getFirestore() {
    return getDb();
}

export async function GET() {
  try {
    const snap = await (await getFirestore()).doc(DOC_PATH).get();
    const data = snap.exists ? snap.data() : {};
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "GET failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SiteSettingsSchema.parse(body);
    await (await getFirestore()).doc(DOC_PATH).set(parsed, { merge: true });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    const msg = e?.message || "POST failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
