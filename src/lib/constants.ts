
export const CMS_PATHS = {
  site: "site/settings",
  pages: "pages",
  page: (slug: string) => `pages/${slug}`, // e.g. pages/home
  navigation: "site/navigation", 
  cases: "cases",
} as const;
