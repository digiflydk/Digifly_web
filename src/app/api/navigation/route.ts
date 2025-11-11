
import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import { NavigationSchema } from "@/lib/schemas";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

const getDb = async () => getFirestore(getAdminApp());

const getDocRef = async () => (await getDb()).doc("site/navigation");

export async function GET() {
  try {
    const doc = await (await getDocRef()).get();
    const data = doc.exists ? doc.data() : defaultNavigation;
    const parsed = NavigationSchema.parse(data);
    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error("[API GET /api/navigation]", e);
    return NextResponse.json({ error: "Failed to load navigation" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const nav = NavigationSchema.parse(body);
    await (await getDocRef()).set(nav, { merge: false }); // Use set with merge:false to overwrite
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[API PUT /api/navigation]", e);
    return NextResponse.json({ error: "Save failed. Check data format." }, { status: 400 });
  }
}
