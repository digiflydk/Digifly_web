"use client";

import { useState, useEffect } from "react";
import { getNavigation, saveNavigation } from "@/lib/cms";
import { NavEditor } from "./NavEditor";
import type { Navigation } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavigationPage() {
    const [data, setData] = useState<Navigation | null>(null);

    useEffect(() => {
        getNavigation().then(setData);
    }, []);

    const handleSave = async (values: Navigation) => {
        try {
          await updateNavigation(values);
          toast({ title: "Success", description: "Navigation saved." });
          // Re-fetch to get the latest state after save, ensuring consistency
          getNavigation().then(setData);
          return true;
        } catch (e: any) {
          toast({ title: "Error", description: e.message || "Could not save navigation.", variant: "destructive" });
          return false;
        }
    };
    
    if (!data) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
      <div className="space-y-8">
        <NavEditor 
            title="Primary Navigation"
            items={data.header}
            onSave={(newItems) => handleSave({ ...data, header: newItems })}
        />
        <NavEditor 
            title="Footer Navigation"
            description="Manage the single column of links in the footer."
            items={data.footer.columns[0]?.links ?? []}
            onSave={(newItems) => handleSave({ 
                ...data, 
                footer: { columns: [{ title: "Links", links: newItems }] } 
            })}
        />
      </div>
    );
}
