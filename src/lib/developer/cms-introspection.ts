
import 'server-only';
import { CMS_PATHS } from '../constants';

// --- API Dump ---
function buildCmsApiDump() {
  const apis = [
    { id: "site-read", path: "/api/cms/site", method: "GET", description: "Fetch global site settings.", usedBy: ["/dadmin/site-seo", "RootLayout"], domain: "cms" },
    { id: "site-write", path: "/api/cms/site", method: "POST", description: "Update global site settings.", usedBy: ["/dadmin/site-seo"], domain: "cms" },
    { id: "nav-read", path: "/api/cms/navigation", method: "GET", description: "Fetch header and footer navigation.", usedBy: ["/dadmin/navigation", "RootLayout"], domain: "cms" },
    { id: "nav-write", path: "/api/cms/navigation", method: "POST", description: "Update navigation links.", usedBy: ["/dadmin/navigation"], domain: "cms" },
    { id: "homepage-read", path: "/api/cms/pages/home", method: "GET", description: "Fetch homepage content.", usedBy: ["/", "/dadmin/homepage"], domain: "cms" },
    { id: "homepage-write", path: "/api/cms/pages/home", method: "POST", description: "Update homepage content.", usedBy: ["/dadmin/homepage"], domain: "cms" },
    { id: "cases-list", path: "/api/cms/cases", method: "GET", description: "List all case studies.", usedBy: ["/cases", "/dadmin/cases"], domain: "cms" },
    { id: "cases-create", path: "/api/cms/cases", method: "POST", description: "Create a new case study.", usedBy: ["/dadmin/cases/new"], domain: "cms" },
    { id: "case-read", path: "/api/cms/cases/{id_or_slug}", method: "GET", description: "Fetch a single case study.", usedBy: ["/cases/[slug]", "/dadmin/cases/[id]"], domain: "cms" },
    { id: "case-update", path: "/api/cms/cases/{id_or_slug}", method: "PUT", description: "Update a case study.", usedBy: ["/dadmin/cases/[id]"], domain: "cms" },
    { id: "case-delete", path: "/api/cms/cases/{id_or_slug}", method: "DELETE", description: "Delete a case study.", usedBy: ["/dadmin/cases"], domain: "cms" },
  ];

  return {
    meta: { generatedAt: new Date().toISOString(), environment: process.env.NODE_ENV },
    apis,
  };
}

// --- DB Structure Dump ---
function buildDbStructureDump() {
  const collections = [
    { name: "site", type: "collection", subcollections: [], samplePaths: [CMS_PATHS.site, CMS_PATHS.navigation], notes: "Global singleton documents for site settings and navigation." },
    { name: "pages", type: "collection", subcollections: [], samplePaths: [CMS_PATHS.page('home'), CMS_PATHS.page('about')], notes: "Content for singleton pages like home, about, etc." },
    { name: "cases", type: "collection", subcollections: [], samplePaths: ["cases/example-case-id"], notes: "Individual case study documents." },
    { name: "admins", type: "collection", subcollections: [], samplePaths: ["admins/user-uid"], notes: "Admin user roles and permissions." },
    { name: "auditLogs", type: "collection", subcollections: [], samplePaths: ["auditLogs/log-id"], notes: "Logs for administrative actions." },
  ];
  return {
    meta: { generatedAt: new Date().toISOString() },
    collections,
  };
}

// --- DB Paths Dump ---
function buildDbPathsDump() {
  const paths = [
    { id: "site-settings", pathPattern: CMS_PATHS.site, usedBy: ["lib/cms-server.ts", "dadmin/site-seo"], domain: "cms", notes: "Primary source for global settings, SEO, contact info." },
    { id: "site-navigation", pathPattern: CMS_PATHS.navigation, usedBy: ["lib/cms-server.ts", "dadmin/navigation"], domain: "cms", notes: "Single document for header and footer navigation." },
    { id: "page-home", pathPattern: CMS_PATHS.page('home'), usedBy: ["lib/cms-server.ts", "app/(site)/page.tsx", "dadmin/homepage"], domain: "cms", notes: "Homepage content." },
    { id: "page-generic", pathPattern: "pages/{slug}", usedBy: ["lib/cms-server.ts", "app/(site)/[...slug]"], domain: "cms", notes: "For other singleton pages like /about, /services." },
    { id: "cases-collection", pathPattern: CMS_PATHS.cases, usedBy: ["lib/cms-server.ts", "app/(site)/cases/page.tsx", "dadmin/cases"], domain: "cms", notes: "Collection of all case studies." },
    { id: "case-doc", pathPattern: "cases/{id}", usedBy: ["lib/cms-server.ts", "app/(site)/cases/[slug]/page.tsx", "dadmin/cases/[id]"], domain: "cms", notes: "Individual case study document." },
  ];
  return {
    meta: { generatedAt: new Date().toISOString() },
    paths,
  };
}

export { buildCmsApiDump, buildDbStructureDump, buildDbPathsDump };
