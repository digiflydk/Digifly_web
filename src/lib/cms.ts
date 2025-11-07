

// Isomorphic (client-side) fetch helpers for the CMS API
// For server-side fetching, use `cms-server.ts` directly.

import { 
    getHomepage, 
    updateHomepage, 
    getCases, 
    deleteCase, 
    getNavigation,
    updateNavigation,
    getSiteSettings,
    saveSiteSettings
} from './cms-api';

export {
    getHomepage,
    updateHomepage,
    getCases,
    deleteCase,
    getNavigation,
    updateNavigation,
    getSiteSettings,
    saveSiteSettings
};
