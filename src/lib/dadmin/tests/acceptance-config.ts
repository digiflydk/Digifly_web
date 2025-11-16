export type AcceptanceSuite = {
  id: string;
  key: string;
  title: string;
  description: string;
  taskId: string;
};

export const ACCEPTANCE_SUITES: AcceptanceSuite[] = [
  {
    id: 'DGF-429',
    key: 'hero-homepage',
    title: 'Hero Banner Acceptance',
    description: 'Validates hero banner configuration (heading, colors, CTA).',
    taskId: 'DGF-429',
  },
  {
    id: 'DGF-406',
    key: 'homepage-io',
    title: 'Homepage Read/Write',
    description: 'Core regression test for homepage CMS data integrity.',
    taskId: 'DGF-406',
  }
];
