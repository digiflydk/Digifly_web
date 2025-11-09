
// This file acts as a server-only facade for CMS server functions.
// We use explicit async forwarding functions instead of a direct re-export barrel
// to ensure this module only exports async functions, complying with Next.js 15's
// "use server" module constraints without needing the directive at the top of this file.
// This provides a stable API surface for server components and API routes.

import {
  getHomepage as _getHomepage,
  updateHomepage as _updateHomepage,
  getSiteSettings as _getSiteSettings,
  saveSiteSettings as _saveSiteSettings,
  getNavigation as _getNavigation,
  saveNavigation as _saveNavigation,
  getCases as _getCases,
  getCaseById as _getCaseById,
  createCase as _createCase,
  updateCase as _updateCase,
  deleteCaseServer as _deleteCase,
} from "./cms-server";

export async function getHomepage(...args: Parameters<typeof _getHomepage>) {
  return _getHomepage(...args);
}
export async function updateHomepage(...args: Parameters<typeof _updateHomepage>) {
  return _updateHomepage(...args);
}
export async function getSiteSettings(...args: Parameters<typeof _getSiteSettings>) {
  return _getSiteSettings(...args);
}
export async function saveSiteSettings(...args: Parameters<typeof _saveSiteSettings>) {
  return _saveSiteSettings(...args);
}
export async function getNavigation(...args: Parameters<typeof _getNavigation>) {
  return _getNavigation(...args);
}
export async function saveNavigation(...args: Parameters<typeof _saveNavigation>) {
  return _saveNavigation(...args);
}
export async function getCases(...args: Parameters<typeof _getCases>) {
  return _getCases(...args);
}
export async function getCaseById(...args: Parameters<typeof _getCaseById>) {
  return _getCaseById(...args);
}
export async function createCase(...args: Parameters<typeof _createCase>) {
  return _createCase(...args);
}
export async function updateCase(...args: Parameters<typeof _updateCase>) {
  return _updateCase(...args);
}
export async function deleteCase(...args: Parameters<typeof _deleteCase>) {
  return _deleteCase(...args);
}

// Compatibility aliases to prevent build warnings from stray imports
export { _updateCase as updateCaseById };
