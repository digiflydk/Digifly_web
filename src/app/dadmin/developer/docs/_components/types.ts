
export type DocStatus = 'ok' | 'draft' | 'missing';

export interface Doc {
  title: string;
  slug: string;                // e.g. 'playwright'
  description: string;
  status: DocStatus;           // restricts to the 3 known states
  lastUpdated?: string;
  href?: string;               // optional direct link if applicable
}
