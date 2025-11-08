
"use server";

// Import only async server functions from cms-server
import {
  getHomePage,
  updateHomepage,
  getSiteSettings,
  saveSiteSettings,
  getNavigation,
  saveNavigation,
  getCases,
  createCase,
  updateCase,
  deleteCase,
  getCaseById,
} from "./cms-server";

// Re-export only async server functions
export {
  getHomePage,
  updateHomepage,
  getSiteSettings,
  saveSiteSettings,
  getNavigation,
  saveNavigation,
  getCases,
  createCase,
  updateCase,
  deleteCase,
  getCaseById,
};
