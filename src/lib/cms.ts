import type { HomePage, CaseDoc, Page, Navigation } from './types';
import { getCmsData } from './cms-server';

// Fallback data
const defaultNavigation: Navigation = {
  header: [],
  footer: {
    columns: []
  },
};

const defaultHomePage: HomePage = {
  hero: { title: 'Welcome', subtitle: 'Subtitle', cta: {label: 'Contact', href: '/contact'}, image: {src: '', alt: ''} },
  intro: { title: 'Intro', text: 'Intro text', image: {src: '', alt: ''} },
  services: [],
  cases: [],
};


export async function getNavigation(): Promise<Navigation> {
  return (await getCmsData('navigation', new URLSearchParams())) ?? defaultNavigation;
}

export async function getHomePage(): Promise<HomePage> {
  return (await getCmsData('home', new URLSearchParams())) ?? defaultHomePage;
}

export async function getCases(): Promise<CaseDoc[]> {
  return (await getCmsData('cases', new URLSearchParams('limit=1000'))) ?? [];
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    try {
        return await getCmsData(`case/${slug}`, new URLSearchParams());
    } catch {
        return null;
    }
}

export async function getAboutPage(): Promise<Page<{ body: any }> | null> {
    return getCmsData('about', new URLSearchParams());
}

export async function getServicesPage(): Promise<Page<{ services: any[] }> | null> {
    return getCmsData('services', new URLSearchParams());
}

export async function getCasesIndexPage(): Promise<Page<{}> | null> {
    return getCmsData('cases-index', new URLSearchParams());
}

export async function getContactPage(): Promise<Page<{}> | null> {
    return getCmsData('contact', new URLSearchParams());
}
