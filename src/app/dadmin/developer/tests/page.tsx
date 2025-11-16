import TestsPanel from '@/components/dadmin/tests/TestsPanel';
import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import { AcceptanceSuiteTable } from '@/components/dadmin/tests/AcceptanceSuiteTable';
import { ACCEPTANCE_SUITES } from '@/lib/dadmin/tests/acceptance-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Playwright Test Runs',
    description: 'Run and view acceptance suites and recent test runs.',
    noIndex: true,
  });
}

export default function Page() {
  return (
    <div className="space-y-8">
      <AcceptanceSuiteTable suites={ACCEPTANCE_SUITES} />
      <div className="border-t pt-8">
        <h2 className="text-lg font-semibold mb-4">All Recent Runs</h2>
        <TestsPanel />
      </div>
    </div>
  );
}
