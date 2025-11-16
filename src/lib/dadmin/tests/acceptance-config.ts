
export type AcceptanceSuite = {
  id: string;
  key: string;
  title: string;
  description: string;
  taskId: string;
};

export const ACCEPTANCE_SUITES: AcceptanceSuite[] = [
  {
    id: 'DGF-406',
    key: 'homepage-io',
    title: 'Homepage CMS core',
    description: 'Regression tests for homepage read/write.',
    taskId: 'DGF-406',
  },
  {
    id: 'DGF-429',
    key: 'hero-config',
    title: 'Hero banner colors & overlay',
    description: 'Acceptance tests for hero overlay and text color configuration.',
    taskId: 'DGF-429',
  },
];
