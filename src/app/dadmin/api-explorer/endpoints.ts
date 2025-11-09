
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type Endpoint = {
  label: string;
  method: HttpMethod;
  path: string;          // use plain string, not string-literal unions
  params: string[];      // dynamic placeholders to be replaced, e.g. ["slug"]
  sampleBody?: unknown;  // optional, only for POST/PUT etc.
};

export const ENDPOINTS: Endpoint[] = [
  // Site settings
  { label: "Site Settings (GET)", method: "GET", path: "/api/cms/site", params: [] },
  {
    label: "Site Settings (PUT)",
    method: "PUT",
    path: "/api/cms/site",
    params: [],
    sampleBody: {
      title: "Digifly | Digital Strategi, Automation & Software udvikling",
      tagline: "We help businesses turn ideas into digital solutions.",
      metaDescription:
        "Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer og driver vækst.",
    },
  },

  // Navigation
  { label: "Navigation Main (GET)", method: "GET", path: "/api/cms/navigation/main", params: [] },
  {
    label: "Navigation Main (PUT)",
    method: "PUT",
    path: "/api/cms/navigation/main",
    params: [],
    sampleBody: {
      items: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Cases", href: "/cases" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },
  { label: "Navigation Footer (GET)", method: "GET", path: "/api/cms/navigation/footer", params: [] },
  {
    label: "Navigation Footer (PUT)",
    method: "PUT",
    path: "/api/cms/navigation/footer",
    params: [],
    sampleBody: {
      columns: [
        { heading: "Company", links: [{ label: "About", href: "/about" }] },
        { heading: "Legal", links: [{ label: "Privacy", href: "/privacy" }] },
      ],
    },
  },

  // Pages
  { label: "Page (GET by slug)", method: "GET", path: "/api/cms/pages/{slug}", params: ["slug"] },
  {
    label: "Page (PUT by slug)",
    method: "PUT",
    path: "/api/cms/pages/{slug}",
    params: ["slug"],
    sampleBody: {
      hero: { title: "About Digifly", subtitle: "Process-driven growth with AI & automation" },
      sections: [
        { type: "richText", html: "<p>Updated about page content…</p>" }
      ],
    },
  },

  // Cases
  { label: "Cases (GET)", method: "GET", path: "/api/cms/cases", params: [] },
  { label: "Case (GET by slug)", method: "GET", path: "/api/cms/cases/{slug}", params: ["slug"] },
  {
    label: "Case (PUT by slug)",
    method: "PUT",
    path: "/api/cms/cases/{slug}",
    params: ["slug"],
    sampleBody: {
      title: "Autostream AI",
      summary: "Automation platform case study",
      published: true,
      content: "<p>Case content…</p>",
    },
  },
];
