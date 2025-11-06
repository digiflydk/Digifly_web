
"use client";

import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/cms";
import { SiteSeoForm } from "@/components/cms/forms/SiteSeoForm";
import { SiteSettings } from "@/lib/types";

// This is a client component that fetches initial data on the client
export default function SiteSeoPageWrapper() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(data => {
      setInitialData(data);
    });
  }, []);

  if (!initialData) {
    return <div>Loading form...</div>;
  }

  return (
    <>
      <SiteSeoForm initialData={initialData} />
    </>
  );
}
