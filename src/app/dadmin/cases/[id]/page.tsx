
import CaseEditor from "@/components/dadmin/cases/CaseEditor";
import { getCaseById } from "@/lib/cms-api";

export default async function Page({ params }: { params: { id: string } }) {
  let initial: any = null;
  try {
    const res = await getCaseById(params.id);
    initial = res.data;
  } catch {}
  return <CaseEditor id={params.id} initial={initial} />;
}
