
import DocsPageContent from './_components/DocsPageContent';

export const dynamic = 'force-dynamic';

export default function Page() {
  // Auth/role checks intentionally omitted here as dadmin is now public.
  return <DocsPageContent />;
}
