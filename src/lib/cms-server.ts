
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
  homePage as defaultHomePage,
  cases as defaultCases,
  aboutPage as defaultAbout,
  servicesPage as defaultServices,
  casesIndexPage as defaultCasesIndex,
  contactPage as defaultContact,
} from '@/lib/cms-data';
import { revalidateTag } from 'next/cache';
import { unstable_cache as nextCache } from 'next/cache';
import { zodErrorToIssues } from './zod-helpers';


const SITE_TAG = "site-settings";
const SITE_SETTINGS_PATH = "site/settings";

async function getSiteSettingsRaw(): Promise<SiteSettings> {
  try {
    const db = getDb();
    const settingsSnap = await db.doc(SITE_SETTINGS_PATH).get();
    const data = settingsSnap.exists ? settingsSnap.data() : {};
    
    // This will use Zod's defaults to fill in any missing nested objects.
    const parsed = SiteSettingsSchema.safeParse(data || {});
    if (!parsed.success) {
      console.error("[getSiteSettingsRaw] Zod validation failed, returning defaults. Errors:", parsed.error.format());
      return SiteSettingsSchema.parse({}); // Return default object on validation failure
    }
    return parsed.data;
  } catch (e) {
    console.error("[getSiteSettingsRaw] Failed to fetch or parse site settings, returning defaults.", e);
    // Return a default object on any error.
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
        
        const mainData = mainSnap.exists ? mainSnap.data() : { items: [] };
        const footerData = footerSnap.exists ? footerSnap.data() : { items: [] };

        const header = NavigationSchema.shape.header.parse(mainData?.items || []);
        
        // Group footer links into one column for simplicity, matching schema
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

type GetHomePageResult = 
  | { ok: true; data: HomePage }
  | { ok: false; data: HomePage; issues: ZodIssue[] };

function buildHomeFallback(raw: any): HomePage {
  const sanitized: HomePage = HomepageSchema.parse({}); // Get a default object
  sanitized.hero.title = raw?.hero?.title || 'Welcome';
  sanitized.hero.subtitle = raw?.hero?.subtitle || '';
  
  if (raw?.hero?.image?.src) {
    sanitized.hero.image = { src: raw.hero.image.src, alt: raw.hero.image.alt || '' };
  }
  
  if (raw?.intro?.image?.src) {
    sanitized.intro!.image = { src: raw.intro.image.src, alt: raw.intro.image.alt || '' };
  }

  return sanitized;
}


export async function getHomePage(options: { debug?: boolean } = {}): Promise<GetHomePageResult> {
  const data = await getPageBySlug('home');
  const parsed = HomepageSchema.safeParse(data || {});
  
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  
  const issues = zodErrorToIssues(parsed.error);
  if (process.env.NODE_ENV === 'development') {
    console.warn("[cms-server] Homepage validation failed. Returning sanitized fallback.", {
      keys: Object.keys(data || {}),
      issues: issues,
    });
  }
  
  return { ok: false, data: buildHomeFallback(data), issues };
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
  
  if (path === 'pages/home') {
    const debug = searchParams?.get('debug') === '1';
    const result = await getHomePage({ debug });
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
