import TestsPanel from '@/components/dadmin/tests/TestsPanel';
import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Playwright Tests',
    description: 'Latest automated UI test runs.',
    noIndex: true,
  });
}

export default function Page() {
  return <TestsPanel />;
}
