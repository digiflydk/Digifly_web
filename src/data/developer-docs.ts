const docs = [
  {
    title: 'CI/CD & App Hosting pipeline',
    slug: 'cicd',
    description:
      'Build → Playwright tests → deploy via apphosting.yaml postbuild. Required default for new builds.',
    status: 'ok',
    lastUpdated: '2025-11-10',
    href: '/dadmin/developer/docs/cicd', // optional route if you add detail pages
  },
  {
    title: 'Playwright tests',
    slug: 'playwright',
    description:
      'How we run tests from Admin and how to read the report JSON. Includes error drill-down.',
    status: 'ok',
    lastUpdated: '2025-11-10',
    href: '/dadmin/developer/playwright',
  },
  {
    title: 'Site & SEO settings',
    slug: 'site-seo',
    description:
      'Structure for General, Contact, Hours, and SEO. How values are used in frontend metadata.',
    status: 'draft',
  },
  {
    title: 'Admin roles',
    slug: 'roles',
    description:
      'Superadmin vs Admin access. What is gated and how to add a superadmin safely.',
    status: 'draft',
  },
  {
    title: 'Env & secrets handling',
    slug: 'env',
    description:
      'Naming of required env keys. Never auto-edit .env from Studio tasks.',
    status: 'ok',
  },
];

export default docs;
