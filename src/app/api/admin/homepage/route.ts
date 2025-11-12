
import { NextResponse } from "next/server";
import { getDb as getAdminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth/serverAuth";
import { HomepageSchema } from "@/lib/schemas";
import { defaultHomepage, normalizeHome } from "@/lib/defaults/siteDefaults";
import { CMS_PATHS } from "@/lib/constants";
import deepmerge from "deepmerge";

async function assertAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("unauthorized");
  }
  return user;
}

export async function GET() {
  try {
    await assertAuth();
    const db = await getAdminDb();
    const snap = await db.doc(CMS_PATHS.page('home')).get();
    const data = snap.exists ? snap.data() : {};
    // Ensure defaults are applied for any missing fields on read
    const merged = deepmerge(defaultHomepage, data ?? {});
    const normalized = normalizeHome(merged);
    const parsed = HomepageSchema.parse(normalized);
    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'unauthorized' ? 401 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await assertAuth();
    const data = await req.json();
    
    // Always normalize before validating and saving
    const normalized = normalizeHome(data);
    const parsed = HomepageSchema.parse(normalized);
    
    const db = await getAdminDb();
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
    
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'unauthorized' ? 401 : 500 });
  }
}
