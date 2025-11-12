
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { NavigationSchema } from "@/lib/schemas";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";
import { revalidatePath } from "next/cache";

const DOC_PATH = "site/navigation";

export const dynamic = 'force-dynamic';

async function getDocRef() {
    const db = await getDb();
    return db.doc(DOC_PATH);
}

export async function GET() {
  try {
    const doc = await getDocRef();
    const snap = await doc.get();
    const data = snap.exists ? snap.data() : defaultNavigation;
    const parsed = NavigationSchema.parse(data);
    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error(`[GET /api/navigation]`, e);
    return NextResponse.json({ error: "Failed to load navigation" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const nav = NavigationSchema.parse(body);
    const doc = await getDocRef();
    await doc.set(nav, { merge: false });

    // Revalidate paths that use this data
    revalidatePath("/", "layout");
    revalidatePath("/dadmin/navigation");

    return NextResponse.json({ ok: true });
  } catch(e: any) {
    console.error(`[PUT /api/navigation]`, e);
    return NextResponse.json({ error: "Save failed. Check data format." }, { status: 400 });
  }
}
