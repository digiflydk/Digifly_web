export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { homePage, navigation, designSettings } from '@/lib/cms-data';

export async function POST(req: Request) {
  const token = req.headers.get('x-seed-token');
  if (!token || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    
    await db.collection("site").doc("settings").set({ design: designSettings }, { merge: true });

    await db.collection("navigation").doc("main").set(
      { items: navigation.main, updatedAt: Date.now() },
      { merge: true }
    );
    await db.collection("navigation").doc("footer").set(
      { items: navigation.footer, updatedAt: Date.now() },
      { merge: true }
    );

    await db.collection("pages").doc("home").set(
      { ...homePage, updatedAt: Date.now() },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
