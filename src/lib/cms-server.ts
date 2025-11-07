

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
import { ImageUrlSchema } from './validators';
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
import { SITE_DEFAULTS, safeImage } from './defaults/siteDefaults';
import { normalizeImageSrc } from './cms-normalize';

const SITE_TAG = "site-settings";
const SITE_SETTINGS_PATH = "site/settings";

function buildHomeFallback(raw: any): HomePage {
  const heroImage = safeImage(raw?.hero?.image);
  const introImage = safeImage(raw?.intro?.image);

  const sanitized = {
    hero: {
      title: raw?.hero?.title || 'From Idea to Intelligent Solution',
      subtitle: raw?.hero?.subtitle || 'Digifly bridges strategy, technology and AI to build digital solutions that deliver measurable results.',
      primaryCta: raw?.hero?.primaryCta || { label: 'Start Your Project', href: '/contact' },
      image: heroImage,
    },
    intro: {
      tagline: raw?.intro?.tagline || 'Why • How • What',
      heading: raw?.intro?.heading || 'We turn complexity into clarity.',
      body: raw?.intro?.body || "We combine analytical strength with deep technological expertise to create elegant, effective solutions. Our process is transparent, collaborative, and always focused on delivering measurable results for your business.",
      image: introImage,
    },
    servicesPreview: raw?.servicesPreview || [],
    featuredCases: raw?.featuredCases || [],
    cta: raw?.cta || { text: "Let's build something intelligent together.", button: { label: "Book a Call", href: "/contact" }},
    seo: raw?.seo || {},
  };
  return HomepageSchema.parse(sanitized);
}


async function getSiteSettingsRaw(): Promise<SiteSettings> {
  try {
    const db = getDb();
    const settingsSnap = await db.doc(SITE_SETTINGS_PATH).get();
    const data = settingsSnap.exists ? settingsSnap.data() : {};
    
    // Deep merge with defaults to ensure all properties exist
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

    // Use safeParse to avoid throwing errors on the server
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
        
        // Match the schema which expects columns
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
  | { ok: true; data: HomePage; issues?: undefined }
  | { ok: false; data: HomePage; issues: ZodIssue[] };


function normalizeHome(doc: any) {
  return {
    ...doc,
    hero: {
      ...doc?.hero,
      image: { ...(doc?.hero?.image ?? {}), src: normalizeImageSrc(doc?.hero?.image?.src) },
    },
    intro: {
      ...doc?.intro,
      image: { ...(doc?.intro?.image ?? {}), src: normalizeImageSrc(doc?.intro?.image?.src) },
    },
  };
}

export async function getHomePage(options: { debug?: boolean } = {}): Promise<GetHomePageResult> {
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
  
  return { ok: false, data: buildHomeFallback(raw), issues };
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
            const parsed = CaseSchema.safeParse({ id: d.id, slug: d.data().slug, ...d.data() });
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
        return snap.docs.map(d => d.data().slug).filter(Boolean);
    } catch (e) {
        return [];
    }
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    try {
        const db = getDb();
        const snap = await db.collection('cases').where('slug', '==', slug).limit(1).get();
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
    const db = getDb();
    const { id, slug: newSlug, ...rest } = data; // remove id/slug from data object
    const querySnap = await db.collection('cases').where('slug', '==', slug).limit(1).get();
    if(querySnap.empty){
        throw new Error(`Case with slug ${slug} not found`);
    }
    const docId = querySnap.docs[0].id;
    await db.collection('cases').doc(docId).set(rest, { merge: true });
    return { id: docId, slug, ...rest };
}

export async function deleteCase(slug: string): Promise<void> {
    const db = getDb();
    const querySnap = await db.collection('cases').where('slug', '==', slug).limit(1).get();
    if (querySnap.empty) {
      throw new Error(`Case with slug ${slug} not found.`);
    }
    const docId = querySnap.docs[0].id;
    await db.collection('cases').doc(docId).delete();
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
    return getPageBySlugData('about');
}

export async function getServicesPage(): Promise<any> {
    return getPageBySlugData('services');
}

export async function getCasesIndexPage(): Promise<any> {
    return getPageBySlugData('cases-index');
}

export async function getContactPage(): Promise<any> {
    return getPageBySlugData('contact');
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
