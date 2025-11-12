
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
  type HomePage,
  type ServiceItem,
} from './schemas';
import { getDb } from '@/lib/firebase-admin';
import type { Navigation, Case, SiteSettings } from '@/lib/schemas';

import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { zodErrorToIssues } from './zod-helpers';
import { defaultHomepage, defaultNavigation } from './defaults/siteDefaults';
import { CMS_PATHS } from './constants';
import { coerceToDefaults } from '@/components/dadmin/site-seo/utils/formDefaults';
import { getNavigation as getNavigationAction, updateNavigation as updateNavigationAction } from './server/cms-actions';
import deepmerge from "deepmerge";


export async function getSiteSettings(): Promise<SiteSettings> {
    noStore(); // Opt out of caching for this function
    const db = await getDb();
    const settingsSnap = await db.doc(CMS_PATHS.site).get();
    const data = settingsSnap.exists ? settingsSnap.data() : {};
    
    // Coerce to defaults to ensure a valid, complete object is always returned
    const coercedData = coerceToDefaults(data);

    // Final validation pass
    const parsed = SiteSettingsSchema.safeParse(coercedData);
    if (!parsed.success) {
      console.error("[getSiteSettings] Zod validation failed after coercion, returning defaults. Errors:", parsed.error.format());
      return coerceToDefaults({});
    }
    return parsed.data;
}


export async function saveSiteSettings(data: any): Promise<SiteSettings> {
  const parsedData = SiteSettingsSchema.parse(data);
  const db = await getDb();
  await db.doc(CMS_PATHS.site).set(parsedData, { merge: true });
  revalidatePath('/', 'layout');
  revalidatePath('/robots.txt');
  revalidatePath('/sitemap.xml');
  return parsedData;
}

export async function getNavigation(): Promise<Navigation> {
    noStore();
    const navData = await getNavigationAction();
    return navData ?? defaultNavigation;
}

export async function saveNavigation(data: Navigation): Promise<void> {
    await updateNavigationAction(data);
}


export async function getPageBySlug(slug: string): Promise<any | null> {
    const db = await getDb();
    const snap = await db.doc(CMS_PATHS.page(slug)).get();
    if (!snap.exists) {
        return null;
    }
    return { id: snap.id, ...snap.data() };
}

export async function getPublishedPagesList() {
    noStore();
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.pages).where('published', '==', true).get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => ({ id: d.id, title: d.data().title || d.id, path: `/${d.id}` }));
}


type GetHomepageResult = 
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; error: string; data: HomePage; issues: z.ZodIssue[] };


function normalizeHero(data: any) {
  if (data?.hero?.slides?.length) {
    data.hero.slides = data.hero.slides.map((s: any) => {
      if (!s) return s;
      if (!s.eyebrow && typeof s.subheading === "string") {
        s.eyebrow = s.subheading;
      }
      if ("subheading" in s) delete s.subheading;
      return s;
    });
  }
  return data;
}

function sanitizeHomepage(input: any): HomePage {
  let hp = deepmerge(defaultHomepage, input ?? {});
  hp = normalizeHero(hp); // Apply hero migration
  
  if (hp?.services?.items?.length) {
    hp.services.items = hp.services.items.map((it: any) => {
      const link = { ...(it?.link ?? {}) };
      // Fallback label to title if empty
      if (!link.label || !link.label.trim()) {
        link.label = String(it?.title ?? "").trim();
      }
      // Ensure mutual exclusivity
      if (link.type === "internal") {
        link.externalUrl = "";
      } else if (link.type === "external") {
        link.internalRef = "";
      }
      return { ...it, link };
    });
  }
  return hp as HomePage;
}


export async function getHomepage(options: { debug?: boolean } = {}): Promise<GetHomepageResult> {
  noStore();
  try {
    const db = await getDb();
    const snap = await db.doc("pages/home").get();
    const data = snap.exists ? snap.data() : {};
    
    const sanitized = sanitizeHomepage(data);
    const parsed = HomepageSchema.safeParse(sanitized);
    
    if (parsed.success) {
      return { ok: true, data: parsed.data };
    }
    
    const issues = zodErrorToIssues(parsed.error);
    if (process.env.NODE_ENV !== 'production' || options.debug) {
      console.warn("[cms-server] Homepage validation failed. Returning sanitized fallback.", {
        issues,
      });
    }

    const safeFallback = HomepageSchema.parse(sanitized);
    
    return { ok: false, error: "Validation failed, returning best-effort data.", data: safeFallback, issues };
  } catch (err: any) {
    console.error("[getHomepage] Firestore fetch failed:", err.message);
    return { ok: false, error: err.message || 'Failed to fetch from Firestore.', data: defaultHomepage, issues: [] };
  }
}

export async function updateHomepage(data: HomePage) {
    const sanitized = sanitizeHomepage(data);
    const parsed = HomepageSchema.parse(sanitized);
    const db = await getDb();
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
    revalidatePath('/');
    return parsed;
}


export async function getCasesServer(options: { publishedOnly?: boolean } = { publishedOnly: true }) {
  noStore();
  const db = await getDb();
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection(CMS_PATHS.cases);
  if (options.publishedOnly) {
    query = query.where('published', '==', true);
  }
  const snap = await query.get();
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return z.array(CaseSchema.partial()).parse(rows);
}

export async function getCases(searchParams?: URLSearchParams): Promise<Case[]> {
    const data = await getCasesServer({ publishedOnly: true });
    return data as Case[];
}

export async function listCaseSlugs(): Promise<string[]> {
    const db = await getDb();
    const snap = await db.collection(CMS_PATHS.cases).select('slug').get();
    if (snap.empty) {
        return [];
    }
    return snap.docs.map(d => d.data().slug).filter(Boolean);
}

export async function getCaseBySlug(slug: string): Promise<Case | null> {
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
}

export async function getCaseById(id: string): Promise<Case> {
  noStore();
  const db = await getDb();
  const snap = await db.collection('cases').doc(id).get();

  if (!snap.exists) {
    throw new Error(`Case not found (id=${id})`);
  }

  const data = { id: snap.id, ...(snap.data() as any) };
  const parsed = CaseSchema.parse(data);
  return parsed;
}

export async function createCase(data: Partial<Case>) {
    const { id, ...payload } = data;
    const db = await getDb();
    const ref = await db.collection(CMS_PATHS.cases).add({
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    revalidatePath('/cases');
    return { id: ref.id, ...payload };
}


export async function updateCase(id: string, data: Partial<Case>) {
    const db = await getDb();
    await db.collection(CMS_PATHS.cases).doc(id).set(data, { merge: true });
    revalidatePath(`/cases/${id}`);
    revalidatePath('/cases');
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
    revalidatePath('/cases');
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
    const nav = await getNavigation();
    return { count: (nav.header.length || 0) + (nav.footer.columns[0]?.links.length || 0) };
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

    
