
"use server";

// This file acts as a server-only facade for CMS server functions.
// It ensures that only async functions are exported, complying with Next.js 15's
// "use server" module constraints.

import {
  getHomepage as _getHomepage,
  getSiteSettings as _getSiteSettings,
  saveSiteSettings as _saveSiteSettings,
  getNavigation as _getNavigation,
  getCases as _getCases,
  getCaseById as _getCaseById,
  getCaseBySlug as _getCaseBySlug,
  createCase as _createCase,
  updateCase as _updateCase,
  deleteCaseServer as _deleteCase,
  updateHomepage as _updateHomepage
} from "./cms-server";

import { saveNavigationAction as _saveNavigation } from './server/cms-actions';

// Re-exporting functions to maintain a stable API surface for components.
export const getHomepage = _getHomepage;
export const updateHomepage = _updateHomepage;
export const getSiteSettings = _getSiteSettings;
export const saveSiteSettings = _saveSiteSettings;
export const getNavigation = _getNavigation;
export const saveNavigation = _saveNavigation;
export const getCases = _getCases;
export const getCaseById = _getCaseById;
export const getCaseBySlug = _getCaseBySlug;
export const createCase = _createCase;
export const updateCase = _updateCase;
export const deleteCase = _deleteCase;

    