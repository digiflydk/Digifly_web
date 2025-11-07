

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
  await db.doc(CMS_PATHS.site).set(parsedData, { merge: true });
  revalidatePath('/', 'layout');
  return parsedData;
}

export async function getNavigation(): Promise<Navigation> {
    try {
        const db = getDb();
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
        console.warn('Falling back to default navigation.', e);
        return defaultNav;
    }
}

export async function getPageBySlug(slug: string): Promise<any | null> {
    try {
        const db = getDb();
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
        console.error(`[getPageBySlug] Failed to fetch page '${slug}', returning null.`, e);
        return null;
    }
}

type GetHomePageResult = 
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; data: HomePage; issues: ZodIssue[] };


export async function getHomePage(options: { debug?: boolean } = {}): Promise<GetHomePageResult> {
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
  
  return { ok: false, data: buildHomeFallback(normalized), issues };
}


export async function updatePage(slug: string, data: any) {
    const db = getDb();
    // A generic page update should be handled with care, or use specific schemas
    await db.doc(CMS_PATHS.page(slug)).set(data, { merge: true });
    return data;
}

export async function getCasesServer() {
  noStore();
  const db = getDb();
  const snap = await db.collection(CMS_PATHS.cases).get();
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return z.array(CaseSchema.partial()).parse(rows);
}

export async function listCases(searchParams?: URLSearchParams): Promise<CaseDoc[]> {
    const data = await getCasesServer();
    return data as CaseDoc[];
}

export async function listCaseSlugs(): Promise<string[]> {
    try {
        const snap = await getDb().collection(CMS_PATHS.cases).select('slug').get();
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
        const snap = await getDb().collection(CMS_PATHS.cases).where('slug', '==', slug).limit(1).get();
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
    const { slug: newSlug, ...rest } = data; // remove slug
    const querySnap = await getDb().collection(CMS_PATHS.cases).where('slug', '==', slug).limit(1).get();
    if(querySnap.empty){
        throw new Error(`Case with slug ${slug} not found`);
    }
    const docId = querySnap.docs[0].id;
    await getDb().collection(CMS_PATHS.cases).doc(docId).set({...rest, slug: newSlug }, { merge: true });
    return { id: docId, slug: newSlug, ...rest };
}

export async function deleteCaseServer(id: string) {
    noStore();
    const ref = getDb().collection(CMS_PATHS.cases).doc(id);
    const s = await ref.get();
    if (!s.exists) {
        return { ok: false, status: 404, error: "Not Found" };
    }
    await ref.delete();
    return { ok: true, status: 200 };
}


export async function getCaseCount(): Promise<{ count: number }> {
    try {
        const snap = await getDb().collection(CMS_PATHS.cases).count().get();
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

export async function updateNavigation(data: z.infer<typeof NavigationSchema>) {
    const db = getDb();
    await db.doc(CMS_PATHS.navigation.main).set({ items: data.header }, { merge: true });
    const footerLinks = data.footer.columns.flatMap(c => c.links);
    await db.doc(CMS_PATHS.navigation.footer).set({ items: footerLinks }, { merge: true });
}

export async function updateHomepage(data: HomePage) {
    const db = getDb();
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
