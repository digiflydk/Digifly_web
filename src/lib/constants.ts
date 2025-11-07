
export const CMS_PATHS = {
  site: "site/settings",
  page: (slug: string) => `pages/${slug}`, // e.g. pages/home
  navigation: {
    main: "navigation/main",
    footer: "navigation/footer",
  },
  cases: "cases",
} as const;
