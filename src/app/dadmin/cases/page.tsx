
import { getCasesServer } from '@/lib/cms-server';
import CasesTable from './CasesTable';

export default async function CasesPage() {
  const rows = await getCasesServer();
  return <CasesTable initialRows={rows} />;
}
