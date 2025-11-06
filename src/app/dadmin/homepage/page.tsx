
"use client";

import { useState, useEffect } from "react";
import { getHomePage } from "@/lib/cms";
import { HomepageForm } from "@/components/cms/forms/HomepageForm";
import type { HomePage } from "@/lib/types";

export default function HomepageAdminPage() {
    const [data, setData] = useState<HomePage | null>(null);

    useEffect(() => {
        getHomePage().then(setData);
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
      <>
        <HomepageForm data={data} />
      </>
    );
}
