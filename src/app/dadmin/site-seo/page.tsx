
"use client";

import { useState, useEffect } from "react";
import { getSiteSeo } from "@/lib/cms";
import { SiteSeoForm } from "@/components/cms/forms/SiteSeoForm";
import { SiteSchema } from "@/lib/schemas";
import { z } from "zod";

type SiteSeoData = z.infer<typeof SiteSchema>;

const defaultData: SiteSeoData = {
  siteTitle: "",
  tagline: "",
  logo: { src: "", alt: "" },
  favicon: { src: "" },
};

export default function SiteSeoPage() {
    const [data, setData] = useState<SiteSeoData | null>(null);

    useEffect(() => {
        getSiteSeo().then(serverData => {
            const parsedData = SiteSchema.parse({
              ...defaultData,
              ...serverData,
              logo: { ...defaultData.logo, ...serverData?.logo },
              favicon: { ...defaultData.favicon, ...serverData?.favicon },
            });
            setData(parsedData);
        });
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
      <>
        <SiteSeoForm data={data} />
      </>
    );
}
