
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
import { revalidatePath } from 'next/cache';
import { unstable_cache as nextCache, unstable_noStore as noStore } from 'next/cache';
import { zodErrorToIssues } from './zod-helpers';
import { SITE_DEFAULTS, defaultHomepage, normalizeHome } from './defaults/siteDefaults';
import { CMS_PATHS } from './constants';


const SITE_TAG = "site-settings";


async function getSiteSettingsRaw(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const settingsSnap = await db.doc(CMS_PATHS.site).get();
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
      console.warn("[getSiteSettingsRaw] Firebase not available, returning defaults.", e);
    }
    return SITE_DEFAULTS;
  }
}


export const getSiteSettings = nextCache(getSiteSettingsRaw, ['site-settings:key'], {
  tags: [SITE_TAG],
});

export async function saveSiteSettings(data: any): Promise<SiteSettings> {
  const parsedData = SiteSettingsSchema.parse(data);
  const db = await getDb();
  await db.doc(CMS_PATHS.site).set(parsedData, { merge: true });
  revalidatePath('/', 'layout');
  return parsedData;
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = await getDb();
        const mainSnap = await db.doc(CMS_PATHS.navigation.main).get();
        const footerSnap = await db.doc(CMS_PATHS.navigation.footer).get();
        
        const mainData = mainSnap.exists ? mainSnap.data() : { items: [] };
        const footerData = footerSnap.exists ? footerSnap.data() : { items: [] };

        const header = NavigationSchema.shape.header.parse(mainData?.items || []);
        
        const footerLinks = (footerData?.items || []).map((item: any) => ({
          label: item.label,
          href: item.href,
        }));
        
        return NavigationSchema.parse({ header, footer: { columns: [{ title: "Links", links: footerLinks }] } });
    } catch(e) {
        console.warn('[cms-server] Firebase not available for navigation, falling back to defaults.', e);
        return defaultNav;
    }
}

export async function getPageBySlug(slug: string): Promise<any | null> {
    try {
        const db = await getDb();
        const snap = await db.doc(CMS_PATHS.page(slug)).get();
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
        console.warn(`[cms-server] Firebase not available for page '${slug}', returning null.`, e);
        return null;
    }
}

type GetHomePageResult = 
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; data: HomePage; issues: ZodIssue[] };


export async function getHomepage(options: { debug?: boolean } = {}): Promise<GetHomePageResult> {
  noStore();
  const raw = await getPageBySlug('home');
  const normalized = normalizeHome(raw ?? {});
  
  const parsed = HomepageSchema.safeParse(normalized);
  
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  
  const issues = zodErrorToIssues(parsed.error);
  if (process.env.NODE_ENV !== 'production' || options.debug) {
    console.warn("[cms-server] Homepage validation failed. Returning sanitized fallback.", {
      issues,
    });
  }
  
  // Create a fallback that's still valid according to the schema
  const fallbackData = {
    ...defaultHomepage,
    ...normalized,
    hero: {
      ...defaultHomepage.hero,
      ...(normalized.hero || {}),
      slides: Array.isArray(normalized.hero?.slides) ? normalized.hero.slides.map((s: any) => ({...defaultHomepage.hero.slides[0], ...s})) : [],
    }
  };
  const safeFallback = HomepageSchema.parse(fallbackData);

  return { ok: false, data: safeFallback, issues };
}


export async function updatePage(slug: string, data: any) {
    const db = await getDb();
    // A generic page update should be handled with care, or use specific schemas
    await db.doc(CMS_PATHS.page(slug)).set(data, { merge: true });
    return data;
}

export async function getCasesServer() {
  noStore();
  try {
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).get();
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return z.array(CaseSchema.partial()).parse(rows);
  } catch (e) {
    console.warn('[cms-server] Firebase not available for cases, returning defaults.', e);
    return defaultCases;
  }
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    const data = await getCasesServer();
    return data as CaseDoc[];
}

export async function listCaseSlugs(): Promise<string[]> {
    try {
        const db = await getDb();
        const snap = await db.collection(CMS_PATHS.cases).select('slug').get();
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
        const db = await getDb();
        const snap = await db.collection(CMS_PATHS.cases).where('slug', '==', slug).limit(1).get();
        if (snap.empty) {
             const fallback = defaultCases.find(c => c.slug === slug);
            return fallback ? (CaseSchema.parse(fallback) as CaseDoc) : null;
        }
        const doc = snap.docs[0];
        const rawData = { id: doc.id, ...doc.data() };
        return CaseSchema.parse(rawData) as CaseDoc;
    } catch (e) {
        const fallback = defaultCases.find(c => c.slug === slug);
        return fallback ? (CaseSchema.parse(fallback) as CaseDoc) : null;
    }
}

export async function createCase(data: z.infer<typeof CaseSchema>): Promise<CaseDoc> {
  const { id, ...payload } = data; // remove id if present
  const db = await getDb();
  const ref = await db.collection(CMS_PATHS.cases).add({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id: ref.id, ...payload } as CaseDoc;
}


export async function updateCaseById(id: string, data: Partial<CaseDoc>) {
    const db = await getDb();
    await db.collection(CMS_PATHS.cases).doc(id).set(data, { merge: true });
    return { id, ...data };
}

export async function deleteCaseServer(id: string) {
    noStore();
    const db = await getDb();
    const ref = db.collection(CMS_PATHS.cases).doc(id);
    const s = await ref.get();
    if (!s.exists) {
        return { ok: false, status: 404, error: "Not Found" };
    }
    await ref.delete();
    return { ok: true, status: 200 };
}


export async function getCaseCount(): Promise<{ count: number }> {
    try {
        const db = await getDb();
        const snap = await db.collection(CMS_PATHS.cases).count().get();
        return { count: snap.data().count };
    } catch {
        return { count: defaultCases.length };
    }
}
export async function getPageCount(): Promise<{ count: number }> {
    try {
        const db = await getDb();
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
    const raw = await getPageBySlug('about');
    return AboutPageSchema.parse(raw || {});
}

export async function getServicesPage(): Promise<any> {
    const raw = await getPageBySlug('services');
    return ServicesPageSchema.parse(raw || {});
}

export async function getCasesIndexPage(): Promise<any> {
    const raw = await getPageBySlug('cases-index');
    return CasesIndexSchema.parse(raw || {});
}

export async function getContactPage(): Promise<any> {
    const raw = await getPageBySlug('contact');
    return ContactPageSchema.parse(raw || {});
}

export async function saveNavigation(data: z.infer<typeof NavigationSchema>) {
    const db = await getDb();
    await db.doc(CMS_PATHS.navigation.main).set({ items: data.header }, { merge: true });
    const footerLinks = data.footer.columns.flatMap(c => c.links);
    await db.doc(CMS_PATHS.navigation.footer).set({ items: footerLinks }, { merge: true });
}

export async function updateHomepage(data: HomePage) {
    const db = await getDb();
    const normalized = normalizeHome(data);
    const parsed = HomepageSchema.parse(normalized);
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
    revalidatePath('/');
    return parsed;
}

export async function getCmsData(path: string, searchParams?: URLSearchParams) {
  noStore();
  if (path === 'health') {
    return { ok: true, ts: Date.now() };
  }
  
  if (path === 'pages/home') {
    const debug = searchParams?.get('debug') === '1';
    const result = await getHomepage({ debug });
    // In API route, always return a JSON object, not just the data part
    return { ...result, data: result.ok ? result.data : result.data };
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
function buildHomeFallback(normalized: Partial<HomePage>): HomePage {
  const parsed = HomepageSchema.safeParse(normalized);
  if (parsed.success) {
    return parsed.data;
  }
  // Fallback to defaultHomepage if even the normalized data fails
  return defaultHomepage;
}


// These functions are newly exported or renamed for cms-api
export async function getCases() {
    return getCasesServer();
}

/** Return one case by Firestore doc ID. Throws if not found or invalid. */
export async function getCaseById(id: string): Promise<CaseDoc> {
  const db = await getDb();
  const snap = await db.collection('cases').doc(id).get();

  if (!snap.exists) {
    throw new Error(`Case not found (id=${id})`);
  }

  const data = { id: snap.id, ...(snap.data() as any) };
  const parsed = CaseSchema.parse(data);
  return parsed;
}

export async function createCaseById(data: CaseDoc) {
    const { id, ...payload } = data;
    const db = await getDb();
    const ref = await db.collection(CMS_PATHS.cases).add(payload);
    return { id: ref.id, ...payload };
}


export async function deleteCase(id: string) {
    return deleteCaseServer(id);
}

export async function updateCase(id: string, data: Partial<CaseDoc>) {
    return updateCaseById(id, data);
}
