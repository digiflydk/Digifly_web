import type { HomePage, CaseDoc, Page, Navigation } from './types';
import { getHomePage as getHomePageData, listCases as getCasesData, getCaseBySlug as getCaseBySlugData, getAboutPage as getAboutPageData, getServicesPage as getServicesPageData, getCasesIndexPage as getCasesIndexPageData, getContactPage as getContactPageData, getNavigation as getNavigationData } from './cms-server';

export async function getNavigation(): Promise<Navigation> {
  return await getNavigationData();
}

export async function getHomePage(): Promise<HomePage> {
  return await getHomePageData();
}

export async function getCases(): Promise<CaseDoc[]> {
  return await getCasesData();
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
