'use server';
import { zDesignTokens, zNavigation, zHome, zCase, zAboutPage, zServicesPage, zCasesIndexPage, zContactPage } from '@/lib/cms-schemas';
import { getDb } from '@/lib/firebase-admin';

export async function getCmsData(path: string, searchParams: URLSearchParams): Promise<any> {
    if (!path || path === 'health') {
        return { ok: true, ts: Date.now() };
    }

    const db = getDb();

    if (path === 'design') {
        const snap = await db.doc('content/settings/design').get();
        return zDesignTokens.parse(snap.data());
    }

    if (path === 'navigation') {
        const snap = await db.doc('content/navigation').get();
        return zNavigation.parse(snap.data());
    }

    if (path === 'home') {
        const snap = await db.doc('content/home').get();
        return zHome.parse(snap.data());
    }
    
    if (path === 'cases') {
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 10;
        const snap = await db.collection('cases').limit(limit).get();
        return zCase.array().parse(snap.docs.map(d => ({ slug: d.id, ...d.data() })));
    }

    if (path.startsWith('case/')) {
        const slug = path.split('/')[1];
        const snap = await db.collection('cases').doc(slug).get();
        if (!snap.exists) return null;
        return zCase.parse({ slug: snap.id, ...snap.data() });
    }
    
    if (path === 'about') {
        const snap = await db.doc('content/about').get();
        return zAboutPage.parse(snap.data());
    }

    if (path === 'services') {
        const snap = await db.doc('content/services').get();
        return zServicesPage.parse(snap.data());
    }

    if (path === 'cases-index') {
        const snap = await db.doc('content/cases-index').get();
        return zCasesIndexPage.parse(snap.data());
    }

    if (path === 'contact') {
        const snap = await db.doc('content/contact').get();
        return zContactPage.parse(snap.data());
    }

    return null;
}
