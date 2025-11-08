"use client";

import { useParams } from "next/navigation";
import CaseForm from "@/components/cms/CaseForm";

export default function EditCasePage() {
  const params = useParams<{ id: string }>();
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Case</h1>
      <CaseForm caseId={params.id} />
    </div>
  );
}
