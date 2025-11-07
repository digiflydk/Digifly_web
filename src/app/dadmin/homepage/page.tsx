
"use client";

import { useState, useEffect } from "react";
import { getPageBySlug } from "@/lib/cms";
import { HomepageForm } from "@/components/cms/forms/HomepageForm";
import { HomePage } from "@/lib/types";
import { HomepageSchema } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function HomepageAdminPage() {
    const [data, setData] = useState<HomePage | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPageBySlug('home')
            .then(pageData => {
                const parsed = HomepageSchema.safeParse(pageData);
                if (parsed.success) {
                    setData(parsed.data);
                } else {
                    console.error("Homepage validation failed:", parsed.error);
                    setError("Loaded data is invalid. Check console for details.");
                    setData(HomepageSchema.parse({})); // fallback to default
                }
            })
            .catch(err => {
                console.error("Failed to load homepage:", err);
                setError(err.message);
            });
    }, []);

    if (error && !data) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Failed to Load Homepage Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!data) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
      <>
        <HomepageForm data={data} />
      </>
    );
}
