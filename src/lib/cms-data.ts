// Central CMS seed data used by API seed route and scripts/cms-seed.ts

export const designSettings = {
  theme: {
    primary: "#6B46C1",
    secondary: "#1F2937",
    accent: "#F59E0B",
  },
  typography: {
    heading: "Inter",
    body: "Inter",
  },
};

export const navigation = {
  main: [
    { label: "Services", href: "/services" },
    { label: "Cases", href: "/cases" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export const homePage = {
  slug: "home",
  hero: {
    eyebrow: "Digifly",
    title: "Digital strategi, automation og software",
    subtitle:
      "Vi bygger skalerbare løsninger, der forbedrer drift og skaber målbar vækst.",
    ctaPrimary: { label: "Kontakt os", href: "/contact" },
    ctaSecondary: { label: "Se cases", href: "/cases" },
  },
  sections: [
    {
      type: "features",
      items: [
        { title: "Strategi", text: "Fra indsigt til handling." },
        { title: "Automation", text: "Reducer manuelle processer." },
        { title: "Software", text: "Byg MVP’er og produkter." },
      ],
    },
  ],
};

export const aboutPage = {};
export const servicesPage = {};
export const contactPage = {};
export const casesIndexPage = {};
export const cases = [];
