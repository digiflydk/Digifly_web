
"use client";

import { useState, useEffect } from "react";
import { updateNavigation } from "@/lib/cms";
import { NavEditor } from "./NavEditor";
import type { Navigation } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavigationPage() {
    const [data, setData] = useState<Navigation | null>(null);

    useEffect(() => {
        // Assuming getNavigation is also in cms and fetches both header and footer
        async function loadNav() {
            try {
                const res = await fetch('/api/cms/navigation');
                const json = await res.json();
                if (!json.ok) throw new Error("Failed to load");
                setData(json.data);
            } catch {
                setData({ header: [], footer: { columns: [] } }); // fallback
            }
        }
        loadNav();
    }, []);

    const handleSave = async (values: Navigation) => {
        try {
          await updateNavigation(values);
          toast({ title: "Success", description: "Navigation saved." });
          // Re-fetch to get the latest state after save, ensuring consistency
          const res = await fetch('/api/cms/navigation');
          const json = await res.json();
          setData(json.data);
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
            description="Manage the first column of links in the footer."
            items={data.footer.columns[0]?.links ?? []}
            onSave={(newItems) => handleSave({ 
                ...data, 
                footer: { columns: [{ title: data.footer.columns[0]?.title || "Links", links: newItems }] } 
            })}
        />
      </div>
    );
}
