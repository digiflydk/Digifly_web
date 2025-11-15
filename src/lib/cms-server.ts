
"use server";
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
} from '@/data/schemas';
import { getDb } from '@/lib/firebase/admin';
import type { Navigation, Case, SiteSettings, HomePage } from '@/lib/types';
import { sanitizeHomepage } from './cms-sanitize';

import { unstable_noStore as noStore } from 'next/cache';
import { zodErrorToIssues } from './zod-helpers';
import { defaultHomepage, defaultNavigation } from '@/data/defaults';
import { CMS_PATHS } from './constants';
import { coerceToDefaults } from '@/components/dadmin/site-seo/utils/formDefaults';
import { getNavigation as getNavigationAction } from './server/cms-actions';
import deepmerge from "deepmerge";
import { logAdminAction } from './dadmin/audit';

// DGF-423: Ensure this module can be imported in non-Next environments (e.g. Playwright)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('server-only');
} catch {
  // In test/Playwright environments, 'server-only' is not available.
  // Ignore the error so tests can import this file without breaking.
}

// DGF-425: Safe wrapper around React cache so acceptance tests can run without Next.js runtime.
let safeCache: <T extends (...args: any[]) => any>(fn: T) => T;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const react = require('react');
  if (typeof react.cache === 'function') {
    safeCache = react.cache;
  } else {
    // Fallback: no caching, just return the original function.
    safeCache = ((fn: any) => fn) as any;
  }
} catch {
  // In test / non-Next environments, 'react' or 'react.cache' may not be available.
  safeCache = ((fn: any) => fn) as any;
}


export const getSiteSettings = safeCache(async (): Promise<SiteSettings> => {
    noStore(); // Opt out of caching for this function
    const db = await getDb();
    const settingsSnap = await db.doc(CMS_PATHS.site).get();
    const data = settingsSnap.exists ? settingsSnap.data() : {};
    
    const coercedData = coerceToDefaults(data);

    const parsed = SiteSettingsSchema.safeParse(coercedData);
    if (!parsed.success) {
      console.error("[getSiteSettings] Zod validation failed after coercion, returning defaults. Errors:", parsed.error.format());
      return coerceToDefaults({});
    }
    return parsed.data;
});


export async function saveSiteSettings(data: any): Promise<SiteSettings> {
  const parsedData = SiteSettingsSchema.parse(data);
  const db = await getDb();
  await db.doc(CMS_PATHS.site).set(parsedData, { merge: true });
  
  // DGF-422: Dynamically import and call revalidatePath
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
    revalidatePath('/robots.txt');
    revalidatePath('/sitemap.xml');
  } catch (e) {
    // Fails safely in non-Next environments
  }
  
  return parsedData;
}

export const getNavigation = safeCache(async (): Promise<Navigation> => {
    noStore();
    const navData = await getNavigationAction();
    return navData ?? defaultNavigation;
});


export const getPageBySlug = safeCache(async (slug: string): Promise<any | null> => {
    const db = await getDb();
    const snap = await db.doc(CMS_PATHS.page(slug)).get();
    if (!snap.exists) {
        return null;
    }
    return { id: snap.id, ...snap.data() };
});

export const getPublishedPagesList = safeCache(async () => {
    noStore();
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.pages).where('published', '==', true).get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => ({ id: d.id, title: d.data().title || d.id, path: `/${d.id}` }));
});


type GetHomepageResult = 
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; error: string; data: HomePage; issues: z.ZodIssue[] };


export const getHomepage = safeCache(async (options: { debug?: boolean } = {}): Promise<GetHomepageResult> => {
  noStore();
  let firestoreSnapshot: any = {};
  let responsePayload: any = {};
  
  try {
    const db = await getDb();
    const snap = await db.doc("pages/home").get();
    const rawData = snap.exists ? snap.data() : {};
    firestoreSnapshot = JSON.parse(JSON.stringify(rawData)); // Deep copy for logging
    
    const sanitized = sanitizeHomepage(rawData);
    const parsed = HomepageSchema.safeParse(sanitized);
    
    if (parsed.success) {
      responsePayload = parsed.data;
      return { ok: true, data: parsed.data };
    }
    
    const issues = zodErrorToIssues(parsed.error);
    if (process.env.NODE_ENV !== 'production' || options.debug) {
      console.warn("[cms-server] Homepage validation failed, returning best-effort data.", { issues });
    }
    
    responsePayload = sanitized;
    return { ok: false, error: "Validation failed, returning best-effort data.", data: sanitized, issues };

  } catch (err: any) {
    console.error("[getHomepage] Firestore fetch failed:", err.message);
    responsePayload = defaultHomepage;
    return { ok: false, error: err.message || 'Failed to fetch from Firestore.', data: defaultHomepage, issues: [] };
  } finally {
      await logAdminAction({
        action: 'homepage.read',
        status: 'ok',
        path: 'pages/home',
        firestoreSnapshot,
        responsePayload,
      });
  }
});

export async function updateHomepage(data: HomePage) {
    const sanitized = sanitizeHomepage(data);
    const parsed = HomepageSchema.parse(sanitized);
    const db = await getDb();
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });

    // DGF-422: Dynamically import and call revalidatePath
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/');
    } catch (e) {
      // Fails safely in non-Next environments
    }
    return parsed;
}

export async function saveHomepage(data: unknown) {
  const db = await getDb();
  const sanitized = sanitizeHomepage(data);
  const parsed = HomepageSchema.parse(sanitized);
  await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });

  // DGF-422: Dynamically import and call revalidatePath
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath("/", "layout");
  } catch (e) {
    // Fails safely in non-Next environments
  }
  return { ok: true };
}


export const getCasesServer = safeCache(async (options: { publishedOnly?: boolean } = { publishedOnly: true }) => {
  noStore();
  const db = await getDb();
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection(CMS_PATHS.cases);
  if (options.publishedOnly) {
    query = query.where('published', '==', true);
  }
  const snap = await query.get();
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return z.array(CaseSchema.partial()).parse(rows);
});

export async function getCases(searchParams?: URLSearchParams): Promise<Case[]> {
    const data = await getCasesServer({ publishedOnly: true });
    await logAdminAction({
      action: 'cases.read',
      status: 'ok',
      path: CMS_PATHS.cases,
      responsePayload: { count: data.length },
    });
    return data as Case[];
}

export const listCaseSlugs = safeCache(async (): Promise<string[]> => {
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).select('slug').get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => d.data().slug).filter(Boolean);
});

export const getCaseBySlug = safeCache(async (slug: string): Promise<Case | null> => {
    noStore();
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
      return rawData as Case;
    }
    return parsed.data as Case;
});

export const getCaseById = safeCache(async (id: string): Promise<Case> => {
  noStore();
  const db = await getDb();
  const snap = await db.collection('cases').doc(id).get();

  if (!snap.exists) {
    throw new Error(`Case not found (id=${id})`);
  }

  const data = { id: snap.id, ...(snap.data() as any) };
  const parsed = CaseSchema.parse(data);
  return parsed;
});

export async function createCase(data: Partial<Case>) {
    const { id, ...payload } = data;
    const db = await getDb();
    const ref = await db.collection(CMS_PATHS.cases).add({
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    // DGF-422: Dynamically import and call revalidatePath
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/cases');
    } catch (e) {
      // Fails safely in non-Next environments
    }
    const saved = { id: ref.id, ...payload };
    await logAdminAction({
      action: 'cases.save',
      status: 'ok',
      path: ref.path,
      payloadSummary: `Created case: ${payload.title}`,
      afterSaveSnapshot: saved,
    });
    return saved;
}


export async function updateCase(id: string, data: Partial<Case>) {
    const db = await getDb();
    await db.collection(CMS_PATHS.cases).doc(id).set(data, { merge: true });
    // DGF-422: Dynamically import and call revalidatePath
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath(`/cases/${id}`);
      revalidatePath('/cases');
    } catch (e) {
      // Fails safely in non-Next environments
    }
    const saved = { id, ...data };
     await logAdminAction({
      action: 'cases.save',
      status: 'ok',
      path: `${CMS_PATHS.cases}/${id}`,
      payloadSummary: `Updated case: ${data.title}`,
      afterSaveSnapshot: saved,
    });
    return saved;
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
    // DGF-422: Dynamically import and call revalidatePath
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/cases');
    } catch (e) {
      // Fails safely in non-Next environments
    }
    return { ok: true, status: 200 };
}


export const getCaseCount = safeCache(async (): Promise<{ count: number }> => {
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).count().get();
    return { count: snap.data().count };
});
export const getPageCount = safeCache(async (): Promise<{ count: number }> => {
    const db = await getDb();
    const snap = await db.collection('pages').count().get();
    return { count: snap.data().count };
});
export const getNavigationMenuCount = safeCache(async (): Promise<{ count: number }> => {
    const nav = await getNavigation();
    return { count: (nav.header.length || 0) + (nav.footer.columns[0]?.links.length || 0) };
});

export const getAboutPage = safeCache(async (): Promise<any> => {
    const raw = await getPageBySlug('about');
    return AboutPageSchema.parse(raw || {});
});

export const getServicesPage = safeCache(async (): Promise<any> => {
    const raw = await getPageBySlug('services');
    return ServicesPageSchema.parse(raw || {});
});

export const getCasesIndexPage = safeCache(async (): Promise<any> => {
    const raw = await getPageBySlug('cases-index');
    return CasesIndexSchema.parse(raw || {});
});

export const getContactPage = safeCache(async (): Promise<any> => {
    const raw = await getPageBySlug('contact');
    return ContactPageSchema.parse(raw || {});
});

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
    return getCases(searchParams);
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
  if (path === 'meta/published-pages') {
      return getPublishedPagesList();
  }
  return null;
}
