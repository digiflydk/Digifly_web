'use server';
import { z } from 'zod';
import { zDesignTokens, zNavigation, zHome, zCase, zAboutPage, zServicesPage, zCasesIndexPage, zContactPage } from '@/lib/cms-schemas';
import { getDb } from '@/lib/firebase-admin';
import type { DesignSettings, HomePage, Navigation, CaseDoc, Page } from '@/lib/types';
import { RichTextContent } from '../lib/types';


export async function getDesign(): Promise<DesignSettings> {
    try {
        const db = getDb();
        const snap = await db.doc('content/design').get();
        const data = snap?.exists ? snap.data() : {};
        return zDesignTokens.parse(data ?? {});
    } catch(e) {
        return zDesignTokens.parse({});
    }
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = getDb();
        const snap = await db.doc('content/navigation').get();
        const data = snap?.exists ? snap.data() : {};
        return zNavigation.parse(data ?? {});
    } catch(e) {
        return zNavigation.parse({});
    }
}

export async function getHomePage(): Promise<HomePage | null> {
    try {
        const db = getDb();
        const snap = await db.doc('content/home').get();
        if (!snap?.exists) return zHome.parse({});
        return zHome.parse(snap.data() ?? {});
    } catch (e) {
        console.error('Zod validation error for home page:', (e as z.ZodError).errors);
        return zHome.parse({});
    }
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    const limit = searchParams?.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 1000;
    const db = getDb();
    const snap = await db.collection('cases').limit(limit).get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => {
        try {
            return zCase.parse({ slug: d.id, ...d.data() });
        } catch (e) {
            console.error(`Zod validation error for case: ${d.id}`, (e as z.ZodError).errors);
            return null;
        }
    }).filter((c): c is CaseDoc => c !== null);
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

export async function getAboutPage(): Promise<Page<{ body: RichTextContent[] }> | null> {
    try {
        const db = getDb();
        const snap = await db.doc('content/about').get();
        if (!snap?.exists) return zAboutPage.parse({});
        return zAboutPage.parse(snap?.data() ?? {});
    } catch (e) {
        console.error('Zod validation error for about page:', (e as z.ZodError).errors);
        return zAboutPage.parse({});
    }
}

export async function getServicesPage(): Promise<Page<{ services: any[] }> | null> {
    try {
        const db = getDb();
        const snap = await db.doc('content/services').get();
        if (!snap?.exists) return zServicesPage.parse({});
        return zServicesPage.parse(snap?.data() ?? {});
    } catch (e) {
        console.error('Zod validation error for services page:', (e as z.ZodError).errors);
        return zServicesPage.parse({});
    }
}

export async function getCasesIndexPage(): Promise<Page<{}> | null> {
    try {
        const db = getDb();
        const snap = await db.doc('content/cases-index').get();
        if (!snap?.exists) return zCasesIndexPage.parse({});
        return zCasesIndexPage.parse(snap?.data() ?? {});
    } catch (e) {
        console.error('Zod validation error for cases index page:', (e as z.ZodError).errors);
        return zCasesIndexPage.parse({});
    }
}

export async function getContactPage(): Promise<Page<{}> | null> {
    try {
        const db = getDb();
        const snap = await db.doc('content/contact').get();
        if (!snap?.exists) return zContactPage.parse({});
        return zContactPage.parse(snap?.data() ?? {});
    } catch (e) {
        console.error('Zod validation error for contact page:', (e as z.ZodError).errors);
        return zContactPage.parse({});
    }
}


export async function getCmsData(path: string, searchParams?: URLSearchParams) {
  if (path === 'health') {
    return { ok: true, ts: Date.now() };
  }
  if (path === 'design') {
    return getDesign();
  }
  if (path === 'navigation') {
    return getNavigation();
  }
  if (path === 'home') {
    return getHomePage();
  }
  if (path === 'cases') {
    return listCases(searchParams);
  }
  return null;
}
