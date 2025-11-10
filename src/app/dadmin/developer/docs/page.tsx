import { redirect } from 'next/navigation';
import { getCurrentUser, isSuperadmin } from '@/lib/auth/roles';
import DocsPageContent from './_components/DocsPageContent';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser();
  if (!isSuperadmin(user?.role)) {
    redirect('/dadmin/forbidden'); 
  }

  return <DocsPageContent />;
}
