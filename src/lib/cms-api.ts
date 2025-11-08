
"use server";

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
  deleteCaseServer,
} from "./cms-server";

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
};

    