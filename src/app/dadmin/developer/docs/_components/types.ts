
export type DocStatus = 'ok' | 'draft' | 'missing';

export interface Doc {
  title: string;
  slug: string;
  description: string;
  status: DocStatus;
  lastUpdated?: string;
  href?: string;
}
