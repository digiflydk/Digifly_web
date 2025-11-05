'use server';
import { z } from 'zod';
import { zDesignTokens, zNavigation, zHome, zCase, zAboutPage, zServicesPage, zCasesIndexPage, zContactPage } from '@/lib/cms-schemas';
import { getDb } from '@/lib/firebase-admin';
import type { DesignSettings, HomePage, Navigation, CaseDoc, Page } from '@/lib/types';
import { RichTextContent } from '../lib/types';


export async function getDesign(): Promise<DesignSettings> {
    const db = getDb();
    const snap = await db.doc('content/settings/design').get().catch(() => null);
    const data = snap?.exists ? snap.data() : {};
    return zDesignTokens.parse(data ?? {});
}

export async function getNavigation(): Promise<Navigation> {
    const db = getDb();
    const snap = await db.doc('content/navigation').get().catch(() => null);
    const data = snap?.exists ? snap.data() : {};
    return zNavigation.parse(data ?? {});
}

export async function getHomePage(): Promise<HomePage> {
    const db = getDb();
    const snap = await db.doc('content/home').get().catch(() => null);
    const data = snap?.exists ? snap.data() : {};
    return zHome.parse(data ?? {});
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

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
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

export async function getAboutPage(): Promise<Page<{ body: RichTextContent[] }>> {
    const db = getDb();
    const snap = await db.doc('content/about').get().catch(() => null);
    return zAboutPage.parse(snap?.data() ?? {});
}

export async function getServicesPage(): Promise<Page<{ services: any[] }>> {
    const db = getDb();
    const snap = await db.doc('content/services').get().catch(() => null);
    return zServicesPage.parse(snap?.data() ?? {});
}

export async function getCasesIndexPage(): Promise<Page<{}>> {
    const db = getDb();
    const snap = await db.doc('content/cases-index').get().catch(() => null);
    return zCasesIndexPage.parse(snap?.data() ?? {});
}

export async function getContactPage(): Promise<Page<{}>> {
    const db = getDb();
    const snap = await db.doc('content/contact').get().catch(() => null);
    return zContactPage.parse(snap?.data() ?? {});
}
