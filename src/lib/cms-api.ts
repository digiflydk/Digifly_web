
// DGF-427: This file acts as the single, stable API surface for CMS operations.
// It is safe to import in both the app and in Node-only tests.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('server-only');
} catch {}

import type { HomePage, SiteSettings, Navigation, Case, Page, CmsLink } from '@/lib/types';
import { 
  getHomepage as getHomepageInternal, 
  getSiteSettings as getSiteSettingsInternal,
  saveSiteSettings as saveSiteSettingsInternal,
  getNavigation as getNavigationInternal,
  getCases as getCasesInternal,
  getCaseById as getCaseByIdInternal,
  getCaseBySlug as getCaseBySlugInternal,
  createCase as createCaseInternal,
  updateCase as updateCaseInternal,
  deleteCaseServer,
  getAboutPage as getAboutPageInternal,
  getServicesPage as getServicesPageInternal,
  getContactPage as getContactPageInternal,
  getCasesIndexPage as getCasesIndexPageInternal,
  getPageBySlug as getPageBySlugInternal, // Add the missing import from cms-server
} from '@/lib/cms-server';
import { 
  saveHomepageAction as saveHomepageInternal,
  saveNavigationAction as saveNavigationInternal,
} from '@/lib/server/cms-actions';

// --- HOMEPAGE ---
export async function getHomepage(): Promise<HomePage> {
  const result = await getHomepageInternal();
  if (!result.ok) {
    // In a test or build context, we want to fail loudly if data is missing.
    // The page component itself handles defaults for the live site.
    throw new Error(result.error ?? 'Failed to read homepage data.');
  }
  return result.data;
}

export async function saveHomepage(payload: HomePage): Promise<{ok: boolean, error?: string}> {
    return saveHomepageInternal(payload);
}
export const updateHomepage = saveHomepage; // Alias for consistency

// --- OTHER PAGES ---
export const getAboutPage = getAboutPageInternal;
export const getServicesPage = getServicesPageInternal;
export const getContactPage = getContactPageInternal;
export const getCasesIndexPage = getCasesIndexPageInternal;
export const getPageBySlug = getPageBySlugInternal; // Export the function

// --- SITE SETTINGS ---
export async function getSiteSettings(): Promise<SiteSettings> {
    return getSiteSettingsInternal();
}

export async function saveSiteSettings(payload: SiteSettings): Promise<void> {
    await saveSiteSettingsInternal(payload);
    // The internal function already returns the saved data, but we just need to confirm success.
}

// --- NAVIGATION ---
export async function getNavigation(): Promise<Navigation> {
    const nav = await getNavigationInternal();
    if (!nav) {
        throw new Error('Navigation data not found.');
    }
    return nav;
}

export async function saveNavigation(payload: Navigation): Promise<void> {
    const result = await saveNavigationInternal(payload);
    if (!result.ok) {
        throw new Error(result.error ?? 'Failed to save navigation.');
    }
}

// --- CASES ---
export async function getCases(): Promise<Case[]> {
  return (await getCasesInternal()) as Case[];
}
export const getCaseById = getCaseByIdInternal;
export const getCaseBySlug = getCaseBySlugInternal;
export const createCase = createCaseInternal;
export const updateCase = updateCaseInternal;
export const deleteCase = deleteCaseServer;

export { CmsLink };
