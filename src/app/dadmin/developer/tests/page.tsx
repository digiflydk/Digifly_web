
import TestsPanel from '@/components/dadmin/tests/TestsPanel';

export const dynamic = 'force-dynamic';

export default async function PlaywrightTestsPage() {
  // Auth/role checks intentionally omitted here as dadmin is now public.
  return <TestsPanel />;
}
