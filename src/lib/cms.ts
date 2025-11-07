

"use client";

import type { CaseDoc } from './types';
import { getCasesServer, deleteCaseServer } from './cms-server';

// --- Cases: Client Helpers ---

export async function getCases() {
  const res = await fetch('/api/cms/cases', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load cases: ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function deleteCaseClient(id: string) {
  const res = await fetch(`/api/cms/cases/${id}`, { method: 'DELETE' });
  if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`Failed to delete case ${id}: ${res.status} ${msg}`);
  }
  return true;
}

// Re-export server actions for client components that need to call them
export {
  getHomePage,
  getPageBySlug,
  updatePage,
  getNavigation,
  updateNavigation,
  updateHomepage,
  getCaseCount,
  getPageCount,
  getNavigationMenuCount,
  getSiteSettings,
  saveSiteSettings,
  updateCase,
  getCaseBySlug,
  getAboutPage,
  getServicesPage,
  getCasesIndexPage,
  getContactPage,
} from './cms-server';
