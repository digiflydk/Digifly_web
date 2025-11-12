import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import { NavigationSchema } from "@/lib/schemas";
import { z } from "zod";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";
import { CMS_PATHS } from "@/lib/constants";

const DOC_REF = () => getFirestore(getAdminApp()).doc(CMS_PATHS.navigation);

export async function GET() {
  try {
    const snap = await DOC_REF().get();
    const data = snap.exists ? snap.data() : defaultNavigation;
    const parsed = NavigationSchema.parse(data);
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("[GET /api/navigation]", err);
    // On parse error, return the default to ensure client doesn't crash
    return NextResponse.json(defaultNavigation);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = NavigationSchema.parse(body);
    await DOC_REF().set(parsed, { merge: false });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, issues: err.issues }, { status: 400 });
    }
    console.error("[PUT /api/navigation]", err);
    return NextResponse.json({ ok: false, error: err?.message || "Invalid payload" }, { status: 500 });
  }
}
