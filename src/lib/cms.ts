import type { HomePage, CaseDoc, Page, Navigation } from './types';
import { getHomePage as getHomePageData, listCases as getCasesData, getCaseBySlug as getCaseBySlugData, getAboutPage as getAboutPageData, getServicesPage as getServicesPageData, getCasesIndexPage as getCasesIndexPageData, getContactPage as getContactPageData, getNavigation as getNavigationData, getSiteSeo as getSiteSeoData, updateSiteSeo as updateSiteSeoData, updateNavigation as updateNavigationData, updateHomepage as updateHomepageData } from './cms-server';

export async function getNavigation(): Promise<Navigation> {
  return await getNavigationData();
}

export async function getHomePage(): Promise<HomePage> {
  return await getHomePageData();
}

export async function getCases(options?: {limit?: number}): Promise<CaseDoc[]> {
  // Directly return the array of cases.
  // The grid component needs the full objects.
  return await getCasesData(new URLSearchParams(options?.limit ? `limit=${options.limit}` : ''));
}

export async function getCaseCount(): Promise<{ count: number }> {
    const cases = await getCasesData();
    return { count: cases.length };
}


export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    return getCaseBySlugData(slug);
}

export async function getAboutPage(): Promise<Page<{ body: any }> | null> {
    return getAboutPageData();
}

export async function getServicesPage(): Promise<Page<{ services: any[] }> | null> {
    return getServicesPageData();
}

export async function getCasesIndexPage(): Promise<Page<{}> | null> {
    return getCasesIndexPageData();
}

export async function getContactPage(): Promise<Page<{}> | null> {
    return getContactPageData();
}

export async function getSiteSeo() {
    return getSiteSeoData();
}

export async function updateSiteSeo(data: any) {
    return updateSiteSeoData(data);
}

export async function updateNavigation(data: any) {
    return updateNavigationData(data);
}

export async function updateHomepage(data: any) {
    return updateHomepageData(data);
}
