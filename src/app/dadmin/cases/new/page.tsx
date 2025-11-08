"use client";
import CaseForm from "@/components/cms/CaseForm";

export default function NewCasePage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create Case</h1>
      <CaseForm />
    </div>
  );
}
