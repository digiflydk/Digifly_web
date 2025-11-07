
'use server';
import { z, type ZodIssue } from 'zod';
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
  cases as defaultCases,
  aboutPage as defaultAbout,
  servicesPage as defaultServices,
  casesIndexPage as defaultCasesIndex,
  contactPage as defaultContact,
} from '@/lib/cms-data';
import { revalidateTag } from 'next/cache';
import { unstable_cache as nextCache, unstable_noStore as noStore } from 'next/cache';
import { zodErrorToIssues } from './zod-helpers';
import { SITE_DEFAULTS, defaultHomepage } from './defaults/siteDefaults';
import { normalizeHome } from './cms-normalize';


const SITE_TAG = "site-settings";
const SITE_SETTINGS_PATH = "site/settings";

function buildHomeFallback(raw: any): HomePage {
  return HomepageSchema.parse({
    ...defaultHomepage,
    ...(raw || {}),
    hero: { ...defaultHomepage.hero, ...(raw?.hero || {}) },
    intro: { ...defaultHomepage.intro, ...(raw?.intro || {}) },
    cta: { ...defaultHomepage.cta, ...(raw?.cta || {}) },
    seo: { ...defaultHomepage.seo, ...(raw?.seo || {}) },
  });
}


async function getSiteSettingsRaw(): Promise<SiteSettings> {
  try {
    const db = getDb();
    const settingsSnap = await db.doc(SITE_SETTINGS_PATH).get();
    const data = settingsSnap.exists ? settingsSnap.data() : {};
    
    const mergedData = { 
        ...SITE_DEFAULTS, 
        ...(data || {}),
        brand: { 
            ...SITE_DEFAULTS.brand, 
            ...(data?.brand || {}),
            logo: { ...SITE_DEFAULTS.brand.logo, ...(data?.brand?.logo || {}) },
            favicon: { ...SITE_DEFAULTS.brand.favicon, ...(data?.brand?.favicon || {}) },
        },
        social: { ...SITE_DEFAULTS.social, ...(data?.social || {}) },
        defaultSeo: { ...SITE_DEFAULTS.defaultSeo, ...(data?.defaultSeo || {}) },
    };

    const parsed = SiteSettingsSchema.safeParse(mergedData);
    if (!parsed.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("[getSiteSettingsRaw] Zod validation failed, returning defaults. Errors:", parsed.error.format());
      }
      return SITE_DEFAULTS; 
    }
    return parsed.data;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("[getSiteSettingsRaw] Failed to fetch or parse site settings, returning defaults.", e);
    }
    return SITE_DEFAULTS;
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
  return parsedData;
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = getDb();
        const mainSnap = await db.doc('navigation/main').get();
        const footerSnap = await db.doc('navigation/footer').get();
        
        const mainData = mainSnap.exists ? mainSnap.data() : { items: [] };
        const footerData = footerSnap.exists ? footerSnap.data() : { items: [] };

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
            const fallbacks: Record<string, any> = {
                home: defaultHomepage,
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

type GetHomePageResult = 
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; data: HomePage; issues: ZodIssue[] };


export async function getHomePage(options: { debug?: boolean } = {}): Promise<GetHomePageResult> {
  const raw = await getPageBySlug('home');
  const normalized = normalizeHome(raw ?? {});
  
  const merged = {
    ...defaultHomepage,
    ...normalized,
    hero: { ...defaultHomepage.hero, ...(normalized?.hero || {}) },
    intro: { ...defaultHomepage.intro, ...(normalized?.intro || {}) },
  };

  const parsed = HomepageSchema.safeParse(merged);
  
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  
  const issues = zodErrorToIssues(parsed.error);
  if (process.env.NODE_ENV !== 'production' || options.debug) {
    console.warn("[cms-server] Homepage validation failed. Returning sanitized fallback.", {
      issues,
    });
  }
  
  // On failure, return the merged data which is at least shape-complete
  return { ok: false, data: buildHomeFallback(merged), issues };
}


export async function updatePage(slug: string, data: any) {
    const db = getDb();
    const parsedData = BasePageSchema.parse(data);
    await db.doc(`pages/${slug}`).set(parsedData, { merge: true });
    return parsedData;
}

export async function getCasesServer() {
  noStore();
  const snap = await getDb().collection('cases').get();
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const parsed = rows.map(r => CaseSchema.partial().parse(r));
  return parsed;
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    const data = await getCasesServer();
    return data as CaseDoc[];
}

export async function listCaseSlugs(): Promise<string[]> {
    try {
        const snap = await getDb().collection('cases').select('slug').get();
        if (snap.empty) {
            return defaultCases.map(c => c.slug);
        }
        return snap.docs.map(d => d.data().slug).filter(Boolean);
    } catch (e) {
        return [];
    }
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    try {
        const snap = await getDb().collection('cases').where('slug', '==', slug).limit(1).get();
        if (snap.empty) {
             const fallback = defaultCases.find(c => c.slug === slug);
            return (fallback as CaseDoc) || null;
        }
        const doc = snap.docs[0];
        const rawData = { id: doc.id, slug, ...doc.data() };
        return rawData as CaseDoc;
    } catch (e) {
        const fallback = defaultCases.find(c => c.slug === slug);
        return (fallback as CaseDoc) || null;
    }
}

export async function updateCase(slug: string, data: z.infer<typeof CaseSchema>) {
    const { id, slug: newSlug, ...rest } = data; // remove id/slug
    const querySnap = await getDb().collection('cases').where('slug', '==', slug).limit(1).get();
    if(querySnap.empty){
        throw new Error(`Case with slug ${slug} not found`);
    }
    const docId = querySnap.docs[0].id;
    await getDb().collection('cases').doc(docId).set(rest, { merge: true });
    return { id: docId, slug, ...rest };
}

export async function deleteCaseServer(id: string) {
    noStore();
    const ref = getDb().collection('cases').doc(id);
    const s = await ref.get();
    if (!s.exists) {
        return { ok: false, status: 404, error: "Not Found" };
    }
    await ref.delete();
    return { ok: true, status: 200 };
}


export async function getCaseCount(): Promise<{ count: number }> {
    try {
        const snap = await getDb().collection('cases').count().get();
        return { count: snap.data().count };
    } catch {
        return { count: defaultCases.length };
    }
}
export async function getPageCount(): Promise<{ count: number }> {
    try {
        const snap = await getDb().collection('pages').count().get();
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
  
  if (path === 'pages/home') {
    const debug = searchParams?.get('debug') === '1';
    const result = await getHomePage({ debug });
    // In API route, always return a JSON object, not just the data part
    return { ...result, data: result.ok ? result.data : buildHomeFallback(result.data) };
  }
  
  if (path.startsWith('pages/')) {
    const slug = path.replace('pages/', '');
    return getPageBySlug(slug);
  }

  if (path === 'navigation') {
    return getNavigation();
  }
  if (path === 'home') {
    const result = await getHomePage();
    return result.data;
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
