
// This file is the single source of truth for the CMS API structure.
// It is used to generate the static JSON map and for runtime checks.

import type { z } from 'zod';
import type { allSchemas } from './schemas';

type SchemaName = keyof typeof allSchemas;

type ApiMethod = {
  path: string;
  schema: SchemaName;
  healthKey?: string;
};

type ApiEndpoint = {
  route: string;
  methods: {
    GET?: ApiMethod;
    PUT?: ApiMethod;
    POST?: ApiMethod;
  };
  usedBy: string[];
};

type ApiGroup = {
  [key: string]: ApiEndpoint;
};

export type CMSMap = {
  site: ApiEndpoint;
  page: ApiEndpoint;
  navigation: ApiGroup;
  cases: ApiGroup;
};


export const CMS_API_MAP: CMSMap = {
  site: {
    route: "/api/cms/site",
    methods: {
      GET: { path: "site/settings", schema: "SiteSettingsSchema", healthKey: 'site' },
      PUT: { path: "site/settings", schema: "SiteSettingsSchema", healthKey: 'site' }
    },
    usedBy: ["/dadmin/site-seo", "Global Layout (Logo/Favicon)", "SEO Defaults"]
  },
  page: {
    route: "/api/cms/pages/[slug]",
    methods: {
      GET: { path: "pages/{slug}", schema: "BasePageSchema" },
      PUT: { path: "pages/{slug}", schema: "BasePageSchema" }
    },
    usedBy: ["/dadmin/pages", "All site pages (e.g. /about, /services)"]
  },
  navigation: {
    main: {
      route: "/api/cms/navigation/main",
      methods: { 
        GET: { path: "navigation/main", schema: "NavigationSchema" },
        PUT: { path: "navigation/main", schema: "NavigationSchema" }
       },
      usedBy: ["/dadmin/navigation", "Header Nav"]
    },
    footer: {
      route: "/api/cms/navigation/footer",
      methods: { 
        GET: { path: "navigation/footer", schema: "NavigationSchema" },
        PUT: { path: "navigation/footer", schema: "NavigationSchema" }
      },
      usedBy: ["/dadmin/navigation", "Footer Nav"]
    }
  },
  cases: {
    list: {
      route: "/api/cms/cases",
      methods: { GET: { path: "cases", schema: "CaseSchema" } },
      usedBy: ["/dadmin/cases", "/cases page", "Homepage"]
    },
    item: {
      route: "/api/cms/cases/[id]",
      methods: {
        GET: { path: "cases/{id}", schema: "CaseSchema" },
        PUT: { path: "cases/{id}", schema: "CaseSchema" }
      },
      usedBy: ["/dadmin/cases/[id]", "/cases/[slug] page"]
    }
  }
} as const;
