
// src/lib/dadmin/tests/acceptance-suites.ts
import type { AcceptanceSuiteId as SuiteId, AcceptanceSuiteTag as SuiteTag } from '@/lib/qa/qa.types';

export type AcceptanceSuiteId = SuiteId;
export type AcceptanceSuiteTag = SuiteTag;

export interface AcceptanceSuite {
  id: AcceptanceSuiteId;
  title: string;
  description: string;
  tag: AcceptanceSuiteTag;
  taskIds: string[];
  sortOrder: number;
}

export const ACCEPTANCE_SUITES: AcceptanceSuite[] = [
  {
    id: 'homepage-cms-core',
    title: 'Homepage CMS core',
    description: 'Regression tests for homepage read/write.',
    tag: '@suite:homepage-cms-core',
    taskIds: ['DGF-406', 'DGF-416', 'DGF-417'],
    sortOrder: 1
  },
  {
    id: 'hero-banner-colors',
    title: 'Hero banner colors & overlay',
    description: 'Acceptance tests for hero banner color and overlay.',
    tag: '@suite:hero-banner-colors',
    taskIds: ['DGF-429', 'DGF-431'],
    sortOrder: 2
  }
];

export function getAcceptanceSuiteById(id: AcceptanceSuiteId) {
  return ACCEPTANCE_SUITES.find(s => s.id === id);
}

export const ALL_ACCEPTANCE_TAGS: AcceptanceSuiteTag[] =
  ACCEPTANCE_SUITES.map(s => s.tag);
