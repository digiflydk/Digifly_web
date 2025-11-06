

'use server';
import { z } from 'zod';
import { zDesignSettings, zNavigation, zHome, zCase, zAboutPage, zServicesPage, zCasesIndexPage, zContactPage, SiteSchema } from './schemas';
import { getDb } from '@/lib/firebase-admin';
import type { DesignSettings, HomePage, Navigation, CaseDoc } from '@/lib/types';
import { designSettings, navigation as defaultNav, homePage as defaultHomePage, cases as defaultCases, aboutPage as defaultAbout, servicesPage as defaultServices, casesIndexPage as defaultCasesIndex, contactPage as defaultContact } from '@/lib/cms-data';

export async function getDesign(): Promise<DesignSettings> {
    try {
        const db = getDb();
        const snap = await db.doc('content/design').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zDesignSettings.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Design settings validation failed');
    } catch(e) {
        console.warn('Falling back to default design settings.', e);
        return designSettings;
    }
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = getDb();
        const snap = await db.doc('content/navigation').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zNavigation.safeParse(data ?? {});
        if (parsed.success) return parsed.data;
        throw new Error('Navigation validation failed');
    } catch(e) {
        console.warn('Falling back to default navigation.', e);
        return defaultNav;
    }
}

export async function getHomePage(): Promise<HomePage> {
    try {
        const db = getDb();
        const snap = await db.doc('content/home').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zHome.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Homepage validation failed');
    } catch (e) {
        console.warn('Falling back to default homepage data.', e);
        return defaultHomePage;
    }
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    try {
        const limit = searchParams?.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 1000;
        const db = getDb();
        const snap = await db.collection('cases').limit(limit).get();
        if (snap.empty) {
            return defaultCases as CaseDoc[];
        }
        const items = snap.docs.map(d => {
            const parsed = zCase.safeParse({ slug: d.id, ...d.data() });
            return parsed.success ? (parsed.data as CaseDoc) : null;
        }).filter((c): c is CaseDoc => c !== null);
        return items;
    } catch(e) {
        console.warn('Falling back to default cases data.', e);
        return defaultCases as CaseDoc[];
    }
}

export async function listCaseSlugs(): Promise<string[]> {
    try {
        const db = getDb();
        const snap = await db.collection('cases').select('slug').get();
        if (snap.empty) {
            return defaultCases.map(c => c.slug);
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
        if (q.empty) {
            const fallback = defaultCases.find(c => c.slug === slug);
            return (fallback as CaseDoc) || null;
        };
        const doc = q.docs[0];
        const rawData = { slug: doc.id, ...doc.data() };
        return rawData as CaseDoc;
    } catch (e) {
        const fallback = defaultCases.find(c => c.slug === slug);
        return (fallback as CaseDoc) || null;
    }
}

export async function getAboutPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('content/about').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zAboutPage.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('About page validation failed');
    } catch (e) {
        console.warn('Falling back to default about page data.', e);
        return defaultAbout;
    }
}

export async function getServicesPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('content/services').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zServicesPage.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Services page validation failed');
    } catch (e) {
        console.warn('Falling back to default services page data.', e);
        return defaultServices;
    }
}

export async function getCasesIndexPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('content/cases-index').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zCasesIndexPage.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Cases index page validation failed');
    } catch (e) {
        console.warn('Falling back to default cases index page data.', e);
        return defaultCasesIndex;
    }
}

export async function getContactPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('content/contact').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = zContactPage.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Contact page validation failed');
    } catch (e) {
        console.warn('Falling back to default contact page data.', e);
        return defaultContact;
    }
}

export async function getSiteSeo() {
    try {
        const db = getDb();
        const snap = await db.doc('site/config').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = SiteSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        return null;
    } catch {
        return null;
    }
}

export async function updateSiteSeo(data: z.infer<typeof SiteSchema>) {
    const db = getDb();
    await db.doc('site/config').set(data, { merge: true });
}

export async function updateNavigation(data: Navigation) {
    const db = getDb();
    await db.doc('content/navigation').set(data, { merge: true });
}

export async function updateHomepage(data: HomePage) {
    const db = getDb();
    await db.doc('content/home').set(data, { merge: true });
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
