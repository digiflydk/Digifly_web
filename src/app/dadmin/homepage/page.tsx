

"use client";

import { useState, useEffect } from "react";
import { HomepageForm } from "@/components/cms/forms/HomepageForm";
import { getHomePage as getHomepageClient } from "@/lib/cms-client";
import type { HomePage } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateHomepage } from "@/lib/cms-api";


export default function HomepageAdminPage() {
    const [data, setData] = useState<HomePage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const result = await getHomepageClient();
                if (!mounted) return;

                if (!result) {
                    throw new Error("Homepage data is not available.");
                }
                setData(result);
                
            } catch (err: any) {
                if (mounted) {
                    setError(err.message);
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
            const result = await updateHomepage(formData);
            if (!result) throw new Error("An unknown error occurred during save.");
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
        <HomepageForm data={data} onSave={handleSave} />
      </>
    );
}
