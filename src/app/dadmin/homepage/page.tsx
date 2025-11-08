
"use client";

import { useState, useEffect } from "react";
import { HomepageForm } from "@/components/cms/forms/HomepageForm";
import { getHomepage, updateHomepage } from "@/lib/cms-api";
import type { HomePage } from "@/lib/schemas";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { ZodIssue } from "zod";
import { toast } from "@/hooks/use-toast";


export default function HomepageAdminPage() {
    const [data, setData] = useState<HomePage | null>(null);
    const [issues, setIssues] = useState<ZodIssue[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const result = await getHomepage();
                if (!mounted) return;

                if (!result || !result.ok) {
                    throw new Error(result.error || "Homepage data is not available.");
                }
                
                setData(result.data);
                
            } catch (err: any) {
                if (mounted) {
                    setError(err.message);
                    // Don't set default data, let the error component show
                    toast({
                      title: "Failed to load data",
                      description: err.message,
                      variant: "destructive",
                    });
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        })();
        return () => { mounted = false; };
    }, []);
    
    const handleSave = async (formData: HomePage) => {
        try {
            await updateHomepage(formData);
            toast({ title: 'Success', description: 'Homepage saved successfully.' });
            return true;
        } catch (e: any) {
            toast({ title: 'Error', description: e.message || "Failed to save homepage.", variant: 'destructive' });
            return false;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }
    
    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Failed to Load Homepage Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (!data) return null;

    return (
      <>
        {issues.length > 0 && (
            <Alert variant="destructive" className="mb-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Validation Issues Detected</AlertTitle>
                <AlertDescription>
                    <p>Your homepage data has issues. Please correct them and save. The form is showing default values where necessary.</p>
                    <ul className="list-disc pl-5 mt-2 text-xs">
                        {issues.map((issue, i) => <li key={i}>{issue.path.join('.')} - {issue.message}</li>)}
                    </ul>
                </AlertDescription>
            </Alert>
        )}
        <HomepageForm data={data} onSave={handleSave} />
      </>
    );
}
