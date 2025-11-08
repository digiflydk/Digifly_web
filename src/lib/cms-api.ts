"use server";

// Import only async server functions from cms-server
import {
  getHomepage,
  updateHomepage,
  getSiteSettings,
  saveSiteSettings,
  getNavigation,
  saveNavigation,
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
} from "./cms-server";

// Re-export only async server functions (no types, constants or helpers)
export {
  getHomepage,
  updateHomepage,
  getSiteSettings,
  saveSiteSettings,
  getNavigation,
  saveNavigation,
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
};
