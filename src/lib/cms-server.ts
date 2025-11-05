
'use server';
import { z } from 'zod';
import { zDesignTokens, zNavigation, zHome, zCase, zAboutPage, zServicesPage, zCasesIndexPage, zContactPage } from '@/lib/cms-schemas';
import { getDb } from '@/lib/firebase-admin';
import type { DesignSettings, HomePage, Navigation, CaseDoc, Page, RichTextContent } from '@/lib/types';

export async function getDesign(): Promise<DesignSettings> {
    try {
        const db = getDb();
        const snap = await db.doc('content/design').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zDesignTokens.safeParse(data ?? {});
        if (parsed.success) {
            if (!parsed.data.brand?.logo?.src) {
                parsed.data.brand = parsed.data.brand ?? { name: 'Digifly' } as any;
                parsed.data.brand.logo = { src: '/logo.svg', alt: parsed.data.brand.name ?? 'Digifly' };
            }
            return parsed.data;
        }
        throw new Error('Design settings validation failed');
    } catch(e) {
        const parsed = zDesignTokens.parse({});
        parsed.brand = parsed.brand ?? { name: 'Digifly' } as any;
        parsed.brand.logo = { src: '/logo.svg', alt: parsed.brand.name ?? 'Digifly' };
        return parsed;
    }
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = getDb();
        const snap = await db.doc('content/navigation').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zNavigation.safeParse(data ?? {});
        if (parsed.success) return parsed.data;
        return zNavigation.parse({});
    } catch(e) {
        return zNavigation.parse({});
    }
}

export async function getHomePage(): Promise<HomePage> {
    try {
        const db = getDb();
        const snap = await db.doc('content/home').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zHome.safeParse(data);
        if (parsed.success) return parsed.data;
        return zHome.parse({});
    } catch (e) {
        return zHome.parse({});
    }
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    try {
        const limit = searchParams?.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 1000;
        const db = getDb();
        const snap = await db.collection('cases').limit(limit).get();
        if (snap.empty) {
            return [];
        }
        return snap.docs.map(d => {
            const parsed = zCase.safeParse({ slug: d.id, ...d.data() });
            return parsed.success ? parsed.data : null;
        }).filter((c): c is CaseDoc => c !== null);
    } catch(e) {
        return [];
    }
}

export async function listCaseSlugs(): Promise<string[]> {
    try {
        const db = getDb();
        const snap = await db.collection('cases').select('slug').get();
        if (snap.empty) {
            return [];
        }
        return snap.docs.map(d => d.get('slug')).filter(Boolean);
    } catch (e) {
        return [];
    }
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    try {
        const db = getDb();
        const q = await db.collection('cases').where('slug', '==', slug).limit(1).get();
        if (q.empty) return null;
        const doc = q.docs[0];
        const parsed = zCase.safeParse({ slug: doc.id, ...doc.data() });
        return parsed.success ? parsed.data : null;
    } catch (e) {
        return null;
    }
}

export async function getAboutPage(): Promise<Page<{ body: RichTextContent[] }>> {
    try {
        const db = getDb();
        const snap = await db.doc('content/about').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zAboutPage.safeParse(data);
        if (parsed.success) return parsed.data;
        return zAboutPage.parse({});
    } catch (e) {
        return zAboutPage.parse({});
    }
}

export async function getServicesPage(): Promise<Page<{ services: any[] }>> {
    try {
        const db = getDb();
        const snap = await db.doc('content/services').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zServicesPage.safeParse(data);
        if (parsed.success) return parsed.data;
        return zServicesPage.parse({});
    } catch (e) {
        return zServicesPage.parse({});
    }
}

export async function getCasesIndexPage(): Promise<Page<{}>> {
    try {
        const db = getDb();
        const snap = await db.doc('content/cases-index').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zCasesIndexPage.safeParse(data);
        if (parsed.success) return parsed.data;
        return zCasesIndexPage.parse({});
    } catch (e) {
        return zCasesIndexPage.parse({});
    }
}

export async function getContactPage(): Promise<Page<{}>> {
    try {
        const db = getDb();
        const snap = await db.doc('content/contact').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zContactPage.safeParse(data);
        if (parsed.success) return parsed.data;
        return zContactPage.parse({});
    } catch (e) {
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
   if (path === 'about') {
    return getAboutPage();
  }
    if (path === 'services') {
    return getServicesPage();
  }
    if (path === 'cases-index') {
    return getCasesIndexPage();
  }
    if (path === 'contact') {
    return getContactPage();
  }
  return null;
}
