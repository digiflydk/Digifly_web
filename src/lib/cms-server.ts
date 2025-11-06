
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
} from './schemas';
import { getAdminApp, getDb } from '@/lib/firebase-admin';
import type { SiteSettings, HomePage, Navigation, CaseDoc, Page } from '@/lib/types';
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

const siteDefaults: SiteSettings = {
  siteTitle: "Digifly",
  tagline: "Digital solutions.",
  defaultDescription: "Digifly builds measurable digital results.",
  logoUrl: "",
  faviconUrl: "",
};


async function getSiteSettingsRaw(): Promise<SiteSettings> {
  try {
    getAdminApp();
    const db = getDb();
    const snap = await db.collection('cms_site').doc('seo').get();
    const data = snap.exists ? snap.data() : {};
    const parsed = SiteSettingsSchema.safeParse(data);
    if (!parsed.success) {
      console.warn('Site settings validation failed, using defaults.', parsed.error);
      return siteDefaults;
    }
    return { ...siteDefaults, ...parsed.data };
  } catch (e) {
    console.warn('Falling back to default site settings.', e);
    return siteDefaults;
  }
}

export const getSiteSettings = nextCache(getSiteSettingsRaw, ['site-settings:key'], {
  tags: [SITE_TAG],
});

export async function saveSiteSettings(data: SiteSettings) {
  const db = getDb();
  await db.collection('cms_site').doc('seo').set(data, { merge: true });
  revalidateTag(SITE_TAG);
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
        
        return { header, footer: { columns: [{ title: "Links", links: footerLinks }] } };

    } catch(e) {
        console.warn('Falling back to default navigation.', e);
        return defaultNav;
    }
}

const HOME_DEFAULTS: Partial<HomePage> = {
  intro: { tagline: 'Why', heading: "Who we are", body: "We help you plan, build and scale digital products." },
  servicesPreview: [],
  featuredCases: [],
  cta: { text: "Ready to talk?", button: { label: "Contact us", href: "/contact"} },
};

export async function getHomePage(): Promise<HomePage> {
    try {
        const db = getDb();
        const snap = await db.doc('pages/home').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = HomepageSchema.safeParse(data);
        if (parsed.success) {
             return {
                ...HOME_DEFAULTS,
                ...parsed.data,
            } as HomePage;
        };
        console.warn("Homepage validation failed", parsed.error);
        return defaultHomePage;
    } catch (e) {
        console.warn('Falling back to default homepage data.', e);
        return defaultHomePage;
    }
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
        const snap = await db.collection('cases').select('slug').get();
        if (snap.empty) {
            return defaultCases.map(c => c.slug);
        }
        return snap.docs.map(d => d.get('slug')).filter(Boolean);
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
        return { count: 4 }; // home, about, services, contact
    }
}
export async function getNavigationMenuCount(): Promise<{ count: number }> {
    return { count: 2 };
}

export async function getAboutPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('pages/about').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = AboutPageSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('About page validation failed');
    } catch (e) {
        console.warn('Falling back to default about page data.', e);
        return defaultAbout;
    }
}

export async function getServicesPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('pages/services').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = ServicesPageSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Services page validation failed');
    } catch (e) {
        console.warn('Falling back to default services page data.', e);
        return defaultServices;
    }
}

export async function getCasesIndexPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('pages/cases-index').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = CasesIndexSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Cases index page validation failed');
    } catch (e) {
        console.warn('Falling back to default cases index page data.', e);
        return defaultCasesIndex;
    }
}

export async function getContactPage(): Promise<any> {
    try {
        const db = getDb();
        const snap = await db.doc('pages/contact').get();
        const data = snap.exists ? snap.data() : {};
        const parsed = ContactPageSchema.safeParse(data);
        if (parsed.success) return parsed.data;
        throw new Error('Contact page validation failed');
    } catch (e) {
        console.warn('Falling back to default contact page data.', e);
        return defaultContact;
    }
}

export async function getSiteSeo() {
    return getSiteSettings();
}

export async function updateSiteSeo(data: z.infer<typeof SiteSettingsSchema>) {
    return saveSiteSettings(data);
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
  if (path === 'site') {
    return getSiteSettings();
  }
  if (path === 'navigation') {
    return getNavigation();
  }
  if (path === 'home') {
    return getHomePage();
  }
  if (path === 'cases') {
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
