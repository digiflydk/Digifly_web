
"use server"

import type { HomePage, CaseDoc, Page, Navigation, SiteSettings } from './types';
import { 
    getHomePage as getHomePageData, 
    listCases, 
    getCaseBySlug as getCaseBySlugData, 
    getAboutPage as getAboutPageData, 
    getServicesPage as getServicesPageData, 
    getCasesIndexPage as getCasesIndexPageData, 
    getContactPage as getContactPageData, 
    getNavigation as getNavigationData, 
    updateNavigation as updateNavigationData, 
    updateHomepage as updateHomepageData,
    getCaseCount as getCaseCountData,
    getPageCount as getPageCountData,
    getNavigationMenuCount as getNavigationMenuCountData,
    getSiteSettings as getSiteSettingsData
} from './cms-server';
import { z } from 'zod';
import { NavigationSchema, SiteSettingsSchema } from './schemas';

export async function getNavigation(): Promise<Navigation> {
  return await getNavigationData();
}

export async function getHomePage(): Promise<HomePage> {
  return await getHomePageData();
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

export async function getSiteSettings() {
    return getSiteSettingsData();
}

export async function saveSiteSettings(data: z.infer<typeof SiteSettingsSchema>) {
    // This is now handled by the API route
    const res = await fetch('/api/cms/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error('Failed to save site settings');
    }
    return res.json();
}

export async function updateNavigation(data: z.infer<typeof NavigationSchema>) {
    return updateNavigationData(data);
}

export async function updateHomepage(data: any) {
    return updateHomepageData(data);
}
