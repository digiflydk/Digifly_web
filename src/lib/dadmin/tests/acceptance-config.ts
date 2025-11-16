
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
    title: 'Homepage Read/Write',
    description: 'Core regression test for homepage CMS data integrity.',
    taskId: 'DGF-406',
  },
  {
    id: 'DGF-429',
    key: 'hero-homepage',
    title: 'Hero Banner Colors & Overlay',
    description: 'Acceptance tests for hero overlay and text color configuration.',
    taskId: 'DGF-429',
  },
];
