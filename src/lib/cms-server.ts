
'use server';
import { z } from 'zod';
import {
  SiteSettingsSchema,
  NavigationSchema,
  HomepageSchema,
  CaseSchema,
  AboutPageSchema,
  ServicesPageSchema,
  CasesIndexSchema,
  ContactPageSchema,
  BasePageSchema,
} from './schemas';
import { getDb } from '@/lib/firebase-admin';
import type { HomePage, Navigation, CaseDoc, SiteSettings, Page } from '@/lib/types';
import {
  navigation as defaultNav,
  homePage as defaultHomePage,
  cases as defaultCases,
  aboutPage as defaultAbout,
  servicesPage as defaultServices,
  casesIndexPage as defaultCasesIndex,
  contactPage as defaultContact,
} from '@/lib/cms-data';
import { revalidateTag } from 'next/cache';
import { unstable_cache as nextCache } from 'next/cache';


const SITE_TAG = "site-settings";
const SITE_SETTINGS_PATH = "site/settings";
const SITE_CONFIG_PATH = "site/config"; // Legacy

async function getSiteSettingsRaw(): Promise<SiteSettings> {
  try {
    const db = getDb();
    let settingsSnap = await db.doc(SITE_SETTINGS_PATH).get();
    let data = settingsSnap.exists ? settingsSnap.data() : {};

    // One-time migration logic
    if (!settingsSnap.exists) {
        const configSnap = await db.doc(SITE_CONFIG_PATH).get();
        if (configSnap.exists) {
            console.log(`[CMS] Migrating legacy 'site/config' to 'site/settings'.`);
            const legacyData = configSnap.data() as any;
            const migratedData = {
                siteTitle: legacyData.siteTitle,
                social: { tagline: legacyData.tagline },
                brand: {
                    logo: { src: legacyData.logoUrl, alt: 'Site Logo' },
                    favicon: { src: legacyData.faviconUrl },
                },
                defaultSeo: { description: legacyData.defaultDescription },
            };
            const parsed = SiteSettingsSchema.parse(migratedData);
            await db.doc(SITE_SETTINGS_PATH).set(parsed);
            console.log(`[CMS] Migration complete. You can now delete 'site/config'.`);
            return parsed;
        }
    }
    
    return SiteSettingsSchema.parse(data || {});
  } catch (e) {
    console.error("[getSiteSettingsRaw] Failed to fetch or parse site settings, returning defaults.", e);
    return SiteSettingsSchema.parse({});
  }
}

export const getSiteSettings = nextCache(getSiteSettingsRaw, ['site-settings:key'], {
  tags: [SITE_TAG],
});

export async function saveSiteSettings(data: any): Promise<SiteSettings> {
  const parsedData = SiteSettingsSchema.parse(data);
  const db = getDb();
  await db.doc(SITE_SETTINGS_PATH).set(parsedData, { merge: true });
  revalidateTag(SITE_TAG);
  const snap = await db.doc(SITE_SETTINGS_PATH).get();
  return SiteSettingsSchema.parse(snap.data() || {});
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = getDb();
        const mainSnap = await db.doc('navigation/main').get();
        const footerSnap = await db.doc('navigation/footer').get();
        
        const mainData = mainSnap.exists ? mainSnap.data() : {};
        const footerData = footerSnap.exists ? footerSnap.data() : {};

        const header = NavigationSchema.shape.header.parse(mainData?.items || []);
        
        const footerLinks = (footerData?.items || []).map((item: any) => ({
          label: item.label,
          href: item.href,
        }));
        
        return NavigationSchema.parse({ header, footer: { columns: [{ title: "Links", links: footerLinks }] } });
    } catch(e) {
        console.warn('Falling back to default navigation.', e);
        return defaultNav;
    }
}

export async function getPageBySlug(slug: string): Promise<any | null> {
    try {
        const db = getDb();
        const snap = await db.doc(`pages/${slug}`).get();
        if (!snap.exists) {
            // Fallback for known pages, useful during development/seeding
            const fallbacks: Record<string, any> = {
                home: defaultHomePage,
                about: defaultAbout,
                services: defaultServices,
                'cases-index': defaultCasesIndex,
                contact: defaultContact,
            };
            return fallbacks[slug] || null;
        }
        return snap.data();
    } catch (e) {
        console.error(`[getPageBySlug] Failed to fetch page '${slug}', returning null.`, e);
        return null;
    }
}

export async function getHomePage(): Promise<HomePage | null> {
    const data = await getPageBySlug('home');
    if (!data) return null;
    const parsed = HomepageSchema.safeParse(data);
    if (parsed.success) return parsed.data;
    console.error("Homepage validation failed:", parsed.error.format());
    return defaultHomePage;
}

export async function updatePage(slug: string, data: any) {
    const db = getDb();
    const parsedData = BasePageSchema.parse(data);
    await db.doc(`pages/${slug}`).set(parsedData, { merge: true });
    return parsedData;
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
            const parsed = CaseSchema.safeParse({ slug: d.id, ...d.data() });
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
        const snap = await db.collection('cases').select().get();
        if (snap.empty) {
            return defaultCases.map(c => c.slug);
        }
        return snap.docs.map(d => d.id).filter(Boolean);
    } catch (e) {
        return [];
    }
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    try {
        const db = getDb();
        const doc = await db.collection('cases').doc(slug).get();
        if (!doc.exists) {
             const fallback = defaultCases.find(c => c.slug === slug);
            return (fallback as CaseDoc) || null;
        }
        const rawData = { slug: doc.id, ...doc.data() };
        return rawData as CaseDoc;
    } catch (e) {
        const fallback = defaultCases.find(c => c.slug === slug);
        return (fallback as CaseDoc) || null;
    }
}

export async function updateCase(slug: string, data: z.infer<typeof CaseSchema>) {
    const db = getDb();
    const { slug: _slug, ...rest } = data; // remove slug from data object
    await db.collection('cases').doc(slug).set(rest, { merge: true });
    return { slug, ...rest };
}

export async function getCaseCount(): Promise<{ count: number }> {
    try {
        const db = getDb();
        const snap = await db.collection('cases').count().get();
        return { count: snap.data().count };
    } catch {
        return { count: defaultCases.length };
    }
}
export async function getPageCount(): Promise<{ count: number }> {
    try {
        const db = getDb();
        const snap = await db.collection('pages').count().get();
        return { count: snap.data().count };
    } catch {
        return { count: 5 }; // home, about, services, cases-index, contact
    }
}
export async function getNavigationMenuCount(): Promise<{ count: number }> {
    return { count: 2 };
}

export async function getAboutPage(): Promise<any> {
    return getPageBySlug('about');
}

export async function getServicesPage(): Promise<any> {
    return getPageBySlug('services');
}

export async function getCasesIndexPage(): Promise<any> {
    return getPageBySlug('cases-index');
}

export async function getContactPage(): Promise<any> {
    return getPageBySlug('contact');
}

export async function updateNavigation(data: z.infer<typeof NavigationSchema>) {
    const db = getDb();
    await db.doc('navigation/main').set({ items: data.header }, { merge: true });
    const footerLinks = data.footer.columns.flatMap(c => c.links);
    await db.doc('navigation/footer').set({ items: footerLinks }, { merge: true });
}

export async function updateHomepage(data: HomePage) {
    const db = getDb();
    await db.doc('pages/home').set(data, { merge: true });
}

export async function getCmsData(path: string, searchParams?: URLSearchParams) {
  if (path === 'health') {
    return { ok: true, ts: Date.now() };
  }
  
  if (path.startsWith('pages/')) {
    const slug = path.replace('pages/', '');
    return getPageBySlug(slug);
  }

  if (path === 'navigation') {
    return getNavigation();
  }
  if (path === 'home') {
    return getHomePage();
  }
  if (path === 'cases') {
    const slug = searchParams?.get('slug');
    if (slug) {
        return getCaseBySlug(slug);
    }
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
