
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

import { revalidatePath } from 'next/cache';
import { unstable_cache as nextCache, unstable_noStore as noStore } from 'next/cache';
import { zodErrorToIssues } from './zod-helpers';
import { SITE_DEFAULTS, defaultHomepage, normalizeHome } from './defaults/siteDefaults';
import { CMS_PATHS } from './constants';


const SITE_TAG = "site-settings";

async function getSiteSettingsRaw(): Promise<SiteSettings> {
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
      console.error("[getSiteSettingsRaw] Zod validation failed, returning defaults. Errors:", parsed.error.format());
      return SITE_DEFAULTS; 
    }
    return parsed.data;
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
}

export async function getPageBySlug(slug: string): Promise<any | null> {
    const db = await getDb();
    const snap = await db.doc(CMS_PATHS.page(slug)).get();
    if (!snap.exists) {
        return null;
    }
    return snap.data();
}

type GetHomePageResult = 
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; error: string; data: HomePage; issues: ZodIssue[] };


export async function getHomepage(options: { debug?: boolean } = {}): Promise<GetHomePageResult> {
  noStore();
  try {
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

    // Even on validation failure, we still want to return data the frontend can attempt to render.
    // The schema defaults will fill in missing required fields.
    const safeFallback = HomepageSchema.parse(normalized);
    
    return { ok: false, error: "Validation failed, returning best-effort data.", data: safeFallback, issues };
  } catch (err: any) {
    console.error("[getHomepage] Firestore fetch failed:", err.message);
    return { ok: false, error: err.message || 'Failed to fetch from Firestore.', data: defaultHomepage, issues: [] };
  }
}

// Backward-compat alias (no breaking imports elsewhere)
export const getHomePage = getHomepage;


export async function updatePage(slug: string, data: any) {
    const db = await getDb();
    await db.doc(CMS_PATHS.page(slug)).set(data, { merge: true });
    return data;
}

export async function getCasesServer() {
  noStore();
  const db = await getDb();
  const snap = await db.collection(CMS_PATHS.cases).get();
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return z.array(CaseSchema.partial()).parse(rows);
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    const data = await getCasesServer();
    return data as CaseDoc[];
}

export async function listCaseSlugs(): Promise<string[]> {
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).select('slug').get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => d.data().slug).filter(Boolean);
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).where('slug', '==', slug).limit(1).get();
    if (snap.empty) {
        return null;
    }
    const doc = snap.docs[0];
    const rawData = { id: doc.id, ...doc.data() };
    const parsed = CaseSchema.safeParse(rawData);
    if (!parsed.success) {
      console.warn(`[getCaseBySlug] Zod validation failed for slug "${slug}"`);
      return rawData as CaseDoc;
    }
    return parsed.data as CaseDoc;
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
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).count().get();
    return { count: snap.data().count };
}
export async function getPageCount(): Promise<{ count: number }> {
    const db = await getDb();
    const snap = await db.collection('pages').count().get();
    return { count: snap.data().count };
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
    // API should return consistent structure
    return result;
  }
  
  if (path.startsWith('pages/')) {
    const slug = path.replace('pages/', '');
    return getPageBySlug(slug);
  }

  if (path === 'navigation') {
    return getNavigation();
  }
  if (path === 'home') {
    const result = await getHomepage();
    if (!result.ok) throw new Error(result.error);
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
  return defaultHomepage;
}

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

export async function createCase(data: Partial<CaseDoc>) {
    const { id, ...payload } = data;
    const db = await getDb();
    const ref = await db.collection(CMS_PATHS.cases).add({
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    return { id: ref.id, ...payload };
}

export async function deleteCase(id: string) {
    return deleteCaseServer(id);
}

export async function updateCase(id: string, data: Partial<CaseDoc>) {
    return updateCaseById(id, data);
}
