
"use server";

// Re-export ONLY async server functions from cms-server
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
  deleteCaseServer as deleteCase,
} from "./cms-server";
