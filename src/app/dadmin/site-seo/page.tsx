
"use client";

import { useState, useEffect } from "react";
import { getSiteSeo } from "@/lib/cms";
import { SiteSeoForm } from "@/components/cms/forms/SiteSeoForm";

export default function SiteSeoPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getSiteSeo().then(setData);
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-8">
            <SiteSeoForm data={data} />
        </div>
    );
}
