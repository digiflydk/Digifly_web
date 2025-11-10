
import { redirect } from 'next/navigation';
import { getCurrentUser, isSuperadmin } from '@/lib/auth/roles';
import TestsPanel from '@/components/dadmin/tests/TestsPanel';

export const dynamic = 'force-dynamic';

export default async function PlaywrightTestsPage() {
  const user = await getCurrentUser();
  if (!isSuperadmin(user?.role)) {
    redirect('/dadmin/forbidden');
  }

  return <TestsPanel />;
}
