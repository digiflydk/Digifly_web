
"use server"

import type { HomePage, CaseDoc, Page, Navigation, SiteSettings } from './types';
import { 
    getHomePage as getHomePageData, 
    listCases, 
    getCaseBySlug as getCaseBySlugData, 
    getPageBySlug as getPageBySlugData,
    updatePage as updatePageData,
    getNavigation as getNavigationData, 
    updateNavigation as updateNavigationData, 
    updateHomepage as updateHomepageData,
    getCaseCount as getCaseCountData,
    getPageCount as getPageCountData,
    getNavigationMenuCount as getNavigationMenuCountData,
    getSiteSettings as getSiteSettingsData,
    saveSiteSettings as saveSiteSettingsData,
    updateCase as updateCaseData
} from './cms-server';
import { z } from 'zod';
import { NavigationSchema, SiteSettingsSchema, CaseSchema } from './schemas';

export async function getNavigation(): Promise<Navigation> {
  return await getNavigationData();
}

export async function getHomePage() {
  return await getHomePageData();
}

export async function getPageBySlug(slug: string): Promise<any | null> {
    return getPageBySlugData(slug);
}

export async function updatePage(slug: string, data: any) {
    return updatePageData(slug, data);
}

export async function getCases(options?: {limit?: number}): Promise<CaseDoc[]> {
  const params = new URLSearchParams();
  if (options?.limit) {
      params.set('limit', String(options.limit));
  }
  return await listCases(params);
}

export async function getCaseCount(): Promise<{ count: number }> {
    return getCaseCountData();
}

export async function getPageCount(): Promise<{ count: number }> {
    return getPageCountData();
}

export async function getNavigationMenuCount(): Promise<{ count: number }> {
    return getNavigationMenuCountData();
}


export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    return getCaseBySlugData(slug);
}

export async function updateCase(slug: string, data: z.infer<typeof CaseSchema>) {
    return updateCaseData(slug, data);
}

export async function getAboutPage(): Promise<Page<{ body: any }> | null> {
    return getPageBySlugData('about');
}

export async function getServicesPage(): Promise<Page<{ services: any[] }> | null> {
    return getPageBySlugData('services');
}

export async function getCasesIndexPage(): Promise<Page<{}> | null> {
    return getPageBySlugData('cases-index');
}

export async function getContactPage(): Promise<Page<{}> | null> {
    return getPageBySlugData('contact');
}

export async function getSiteSettings(): Promise<SiteSettings> {
    return getSiteSettingsData();
}

export async function saveSiteSettings(data: z.infer<typeof SiteSettingsSchema>) {
    return saveSiteSettingsData(data);
}

export async function updateNavigation(data: z.infer<typeof NavigationSchema>) {
    return updateNavigationData(data);
}

export async function updateHomepage(data: any) {
    return updateHomepageData(data);
}
