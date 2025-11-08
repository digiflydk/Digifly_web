
import CaseEditor from "@/components/dadmin/cases/CaseEditor";
import { getCaseById } from "@/lib/cms-api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  let initial: any = null;
  let error: string | null = null;
  try {
    const data = await getCaseById(params.id);
    initial = data;
  } catch(e: any) {
    error = e.message || "Failed to load case data.";
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Loading Case Study</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  return <CaseEditor id={params.id} initial={initial} />;
}
