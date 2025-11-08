// Server component
import CasesTable from "@/components/cms/CasesTable";
import { getCases } from "@/lib/cms-api";

export const dynamic = 'force-dynamic';

export default async function CasesAdminPage() {
  const cases = await getCases();
  return (
    <div>
      <CasesTable initialRows={cases} />
    </div>
  );
}
