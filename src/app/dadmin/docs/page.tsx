import DocsPageContent from '../developer/docs/_components/DocsPageContent';

export const dynamic = 'force-dynamic';

export default function Page() {
  // Auth/role checks intentionally omitted here to avoid importing non-existent helpers.
  // Protection should be provided by middleware or a valid helper in a later task.
  return <DocsPageContent />;
}
