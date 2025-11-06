
"use client";

import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/cms-server";
import { SiteSeoForm } from "@/components/cms/forms/SiteSeoForm";
import { SiteSettings } from "@/lib/types";

// This is a server component that fetches initial data
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
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Site &amp; SEO</h1>
        <p className="text-sm text-slate-500">Manage global site identity and default SEO.</p>
      </header>
      <SiteSeoForm initialData={initialData} />
    </>
  );
}
