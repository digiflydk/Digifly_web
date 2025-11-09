
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
  getCases as _getCases,
} from "@/lib/cms-server";

/**
 * Prefer specific getters if they exist; fall back to generic by slug.
 * All exports are async functions to respect the "use server" boundary.
 */

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

export async function getCases(...args: Parameters<typeof _getCases>) {
    return _getCases(...args);
}
