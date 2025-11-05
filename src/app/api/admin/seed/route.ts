export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { homePage, navigation, designSettings } from '@/lib/cms-data';

export async function POST(req: Request) {
  const token = req.headers.get('x-seed-token');
  if (!token || token !== process.env.ADMIN_SEED_TOKEN) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const db = getDb();
    const batch = db.batch();
    const contentRef = db.collection('content');

    const docsToSeed = [
      { id: 'home', data: homePage },
      { id: 'navigation', data: navigation },
      { id: 'design', data: designSettings },
    ];

    let seededCount = 0;

    for (const { id, data } of docsToSeed) {
      const docRef = contentRef.doc(id);
      const snap = await docRef.get();
      if (!snap.exists) {
        batch.set(docRef, data);
        seededCount++;
      }
    }

    if (seededCount > 0) {
      await batch.commit();
      return NextResponse.json({ ok: true, message: `Successfully seeded ${seededCount} documents.` });
    } else {
      return NextResponse.json({ ok: true, message: 'All content documents already exist. No action taken.' });
    }
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
