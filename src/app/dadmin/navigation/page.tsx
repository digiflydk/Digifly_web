
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
        <header className="mb-6">
            <h1 className="text-xl font-semibold">Navigation</h1>
            <p className="text-sm text-slate-500">Manage primary and footer menus.</p>
        </header>
        <NavigationForm data={data} />
      </>
    );
}
