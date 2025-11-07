
import { NextResponse, NextRequest } from 'next/server';
import { CMS_API_MAP } from '@/lib/cms-map';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkHealth() {
  const db = getFirestore(getAdminApp());
  const healthResults: Record<string, { ok: boolean; reason?: string }> = {};

  const checkDoc = async (key: string, path: string) => {
    try {
      const doc = await db.doc(path).get();
      healthResults[key] = { ok: doc.exists };
      if (!doc.exists) {
        healthResults[key].reason = "Document not found";
      }
    } catch (e: any) {
      healthResults[key] = { ok: false, reason: e.message };
    }
  };

  const checkCollection = async (key: string, path: string) => {
    try {
      const snap = await db.collection(path).limit(1).get();
      healthResults[key] = { ok: true }; // if it doesn't throw, it's ok
    } catch (e: any) {
      healthResults[key] = { ok: false, reason: e.message };
    }
  };

  await Promise.all([
    checkDoc('site', 'site/settings'),
    checkDoc('navigation.main', 'navigation/main'),
    checkDoc('navigation.footer', 'navigation/footer'),
    checkDoc('page.home', 'pages/home'),
    checkDoc('page.about', 'pages/about'),
    checkDoc('page.services', 'pages/services'),
    checkDoc('page.cases-index', 'pages/cases-index'),
    checkDoc('page.contact', 'pages/contact'),
    checkCollection('cases.list', 'cases'),
  ]);

  return healthResults;
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const health = searchParams.get('health') === '1';

    let healthData = {};
    if (health) {
        try {
            healthData = await checkHealth();
        } catch (e: any) {
            return NextResponse.json({ ok: false, error: 'Health check failed', details: e.message }, { status: 500 });
        }
    }

    return NextResponse.json({ map: CMS_API_MAP, health: healthData });
}
