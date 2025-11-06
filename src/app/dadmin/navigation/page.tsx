
"use client";

import { useState, useEffect } from "react";
import { getNavigation } from "@/lib/cms";
import { NavigationForm } from "@/components/cms/forms/NavigationForm";
import type { Navigation } from "@/lib/types";


export default function NavigationPage() {
    const [data, setData] = useState<Navigation | null>(null);

    useEffect(() => {
        getNavigation().then(setData);
    }, []);

    if (!data) {
        return <div>Loading...</div>
    }

    return (
      <>
        <NavigationForm data={data} />
      </>
    );
}
