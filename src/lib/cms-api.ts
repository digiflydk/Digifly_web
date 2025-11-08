
"use server";

// Re-export only async server functions from cms-server
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
} from "./cms-server";
