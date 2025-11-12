
"use server";

import {
  // Generic
  getPageBySlug,
  // Specific getters (use if present in cms-server)
  getHomepage as _getHomepage,
  getAboutPage as _getAboutPage,
  getServicesPage as _getServicesPage,
  getContactPage as _getContactPage,
  getCasesIndexPage as _getCasesIndexPage,
  // navigation + cases (server)
  getNavigation as _getNavigation,
  saveNavigation as _saveNavigation,
  getCases as _getCases,
  getCaseById as _getCaseById,
  getCaseBySlug as _getCaseBySlug,
  updateCase as _updateCase,
  createCase as _createCase,
  deleteCase as _deleteCase,
  updateHomepage as _updateHomepage,
  getSiteSettings as _getSiteSettings,
  saveSiteSettings as _saveSiteSettings,
} from "@/lib/cms-api"; // Correct: Import from the facade
import { Navigation } from "./types";

/** -------- Static pages (keep fallbacks to generic) -------- */
export async function getHomepage() {
  if (typeof _getHomepage === "function") return _getHomepage();
  return getPageBySlug?.("home");
}
export async function getAboutPage() {
  if (typeof _getAboutPage === "function") return _getAboutPage();
  return getPageBySlug?.("about");
}
export async function getServicesPage() {
  if (typeof _getServicesPage === "function") return _getServicesPage();
  return getPageBySlug?.("services");
}
export async function getContactPage() {
  if (typeof _getContactPage === "function") return _getContactPage();
  return getPageBySlug?.("contact");
}
export async function getCasesIndexPage() {
  if (typeof _getCasesIndexPage === "function") return _getCasesIndexPage();
  return getPageBySlug?.("cases-index");
}

/** -------- Navigation -------- */
export async function getNavigation() {
  return _getNavigation?.();
}
// keep admin import name stable: updateNavigation -> calls saveNavigation
export async function updateNavigation(
  data: Navigation
) {
  return _saveNavigation?.(data);
}
export const saveNavigation = updateNavigation; // Alias

/** -------- Cases helpers (+ param normalization) -------- */
function toSearchParams(
  params?: URLSearchParams | { published?: boolean; q?: string }
): URLSearchParams | undefined {
  if (!params) return undefined;
  if (params instanceof URLSearchParams) return params;
  const sp = new URLSearchParams();
  if (typeof params.published === "boolean") {
    sp.set("published", params.published ? "true" : "false");
  }
  if (params.q) sp.set("q", params.q);
  return sp;
}

export async function getCases(
  params?: URLSearchParams | { published?: boolean; q?: string }
) {
  return _getCases?.(toSearchParams(params));
}

export async function getCaseById(id: string) {
  return _getCaseById?.(id);
}

export async function getCaseBySlug(slug: string) {
  return _getCaseBySlug?.(slug);
}

export async function updateCase(id: string, data: any) {
  return _updateCase?.(id, data);
}

export async function createCase(data: any) {
  return _createCase?.(data);
}

export async function deleteCase(id: string) {
  return _deleteCase?.(id);
}

/** -------- Site settings passthroughs (used by admin) -------- */
export async function getSiteSettings() {
  return _getSiteSettings?.();
}
export async function saveSiteSettings(input: any) {
  return _saveSiteSettings?.(input);
}
export async function updateHomepage(input: any) {
  return _updateHomepage?.(input);
}
