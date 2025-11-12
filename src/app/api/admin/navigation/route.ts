
import { NextResponse } from "next/server";
import { getDb as getAdminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth/serverAuth";
import { NavigationSchema } from "@/lib/schemas";
import { CMS_PATHS } from "@/lib/constants";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";
import deepmerge from "deepmerge";

async function assertAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("unauthorized");
  }
}

export async function GET() {
  try {
    await assertAuth();
    const db = await getAdminDb();
    const snap = await db.doc(CMS_PATHS.navigation).get();
    const data = snap.exists ? snap.data() : {};
    const merged = deepmerge(defaultNavigation, data ?? {});
    const parsed = NavigationSchema.parse(merged);
    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'unauthorized' ? 401 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    await assertAuth();
    const data = await req.json();
    const parsed = NavigationSchema.parse(data);
    const db = await getAdminDb();
    await db.doc(CMS_PATHS.navigation).set(parsed, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'unauthorized' ? 401 : 500 });
  }
}
