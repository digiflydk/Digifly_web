
export * from "./cms-api";

// Re-export server actions for client components that need them
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
  getAboutPage,
  getServicesPage,
  getCasesIndexPage,
  getContactPage,
} from './cms-server';
