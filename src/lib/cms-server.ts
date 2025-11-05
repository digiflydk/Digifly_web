'use server';
import { z } from 'zod';
import { zDesignTokens, zNavigation, zHome, zCase, zAboutPage, zServicesPage, zCasesIndexPage, zContactPage } from '@/lib/cms-schemas';
import { getDb } from '@/lib/firebase-admin';

export async function getCmsData(path: string, searchParams: URLSearchParams): Promise<any> {
    if (!path || path === 'health') {
        return { ok: true, ts: Date.now() };
    }

    const db = getDb();

    try {
        if (path === 'design') {
            const snap = await db.doc('content/settings/design').get();
            return snap.exists ? zDesignTokens.parse(snap.data()) : null;
        }

        if (path === 'navigation') {
            const snap = await db.doc('content/navigation').get();
            return snap.exists ? zNavigation.parse(snap.data()) : null;
        }

        if (path === 'home') {
            const snap = await db.doc('content/home').get();
            return snap.exists ? zHome.parse(snap.data()) : null;
        }
        
        if (path === 'cases') {
            return await listCases(searchParams);
        }
        
        if (path.startsWith('case/')) {
            const slug = path.split('/')[1];
            return await getCaseBySlug(slug);
        }
        
        if (path === 'about') {
            const snap = await db.doc('content/about').get();
            return snap.exists ? zAboutPage.parse(snap.data()) : null;
        }

        if (path === 'services') {
            const snap = await db.doc('content/services').get();
            return snap.exists ? zServicesPage.parse(snap.data()) : null;
        }

        if (path === 'cases-index') {
            const snap = await db.doc('content/cases-index').get();
            return snap.exists ? zCasesIndexPage.parse(snap.data()) : null;
        }

        if (path === 'contact') {
            const snap = await db.doc('content/contact').get();
            return snap.exists ? zContactPage.parse(snap.data()) : null;
        }
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error(`Zod validation error for path: ${path}`, e.errors);
        } else {
            console.error(`Error fetching data for path: ${path}`, e);
        }
        return null; // Return null on error to prevent crashes
    }

    return null;
}

export async function listCases(searchParams?: URLSearchParams) {
    const limit = searchParams?.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 1000;
    const db = getDb();
    const snap = await db.collection('cases').limit(limit).get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => zCase.parse({ slug: d.id, ...d.data() }));
}

export async function listCaseSlugs(): Promise<string[]> {
  const db = getDb();
  const snap = await db.collection('cases').select('slug').get();
  if (snap.empty) {
      return [];
  }
  return snap.docs.map(d => d.get('slug')).filter(Boolean);
}

export async function getCaseBySlug(slug: string) {
    const db = getDb();
    const q = await db.collection('cases').where('slug', '==', slug).limit(1).get();
    if (q.empty) return null;
    const doc = q.docs[0];
    try {
        return zCase.parse({ slug: doc.id, ...doc.data() });
    } catch (e) {
        console.error(`Zod validation error for case slug: ${slug}`, (e as z.ZodError).errors);
        return null;
    }
}
