

"use client";

import type { HomePage, CaseDoc, Page, Navigation, SiteSettings } from './types';
import { 
    getHomePage as getHomePageData, 
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
    updateCase as updateCaseData,
} from './cms-server';
import { z } from 'zod';
import { NavigationSchema, SiteSettingsSchema, CaseSchema } from './schemas';

// --- Cases: Client Helpers ---

export async function getCases(params?: { published?: boolean; limit?: number }) {
  const qp = new URLSearchParams();
  if (params?.published !== undefined) qp.set('published', String(params.published));
  if (params?.limit) qp.set('limit', String(params.limit));
  const res = await fetch(`/api/cms/cases?${qp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load cases: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function deleteCase(id: string) {
  const res = await fetch(`/api/cms/cases/${id}`, { method: 'DELETE' });
  if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`Failed to delete case ${id}: ${res.status} ${msg}`);
  }
  return true;
}


// --- Client/Server Passthrough ---

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
    return getPageBySlugData(slug);
}

export async function updateCase(slug: string, data: z.infer<typeof CaseSchema>) {
    return updateCaseData(slug, data);
}

export async function deleteCaseClient(id: string): Promise<void> {
  const res = await fetch(`/api/cms/cases/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Failed to delete case ${id}: ${res.status} ${msg}`);
  }
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
    const raw = await getSiteSettingsData();
    // Re-parsing here on the client-side server action to be safe
    const parsed = SiteSettingsSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn("Loaded site settings were invalid. Using defaults.", parsed.error);
      return SiteSettingsSchema.parse({});
    }
    return parsed.data;
}

export async function saveSiteSettings(data: z.infer<typeof SiteSettingsSchema>) {
    const res = await fetch('/api/cms/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: { message: "Unknown error" } }));
        throw new Error(errorBody?.error?.message || `Save failed with status ${res.status}`);
    }
    const result = await res.json();
    if (!result.ok) {
        throw new Error(result.error.message || "Save failed.");
    }
    return result.data;
}

export async function updateNavigation(data: z.infer<typeof NavigationSchema>) {
    return updateNavigationData(data);
}

export async function updateHomepage(data: any) {
    return updateHomepageData(data);
}
