
"use client";

import { useEffect, useState } from "react";
import type { Navigation } from "@/lib/schemas";
import NavEditor from "./NavEditor";
import { toast } from "@/hooks/use-toast";
import { getPublishedPagesList } from "@/lib/cms-server";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

type PageInfo = { id: string; title: string, path: string };

export default function NavigationPage() {
  const [data, setData] = useState<Navigation | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [navRes, pagesRes] = await Promise.all([
          fetch("/api/navigation", { cache: "no-store" }),
          getPublishedPagesList()
        ]);

        if (!navRes.ok) {
          throw new Error(`Failed to load navigation data: ${navRes.statusText}`);
        }
        
        setData(await navRes.json());
        setPages(pagesRes);

      } catch (e: any) {
        toast({ title: "Load failed", description: e.message, variant: "destructive" });
        setData(defaultNavigation); // Fallback on error
      }
    })();
  }, []);

  async function onSave(next: Navigation) {
    setSaving(true);
    try {
      const res = await fetch("/api/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      
      const resBody = await res.json();

      if (!res.ok || resBody.ok === false) {
        const errorMsg = resBody.issues ? resBody.issues.map((i: any) => i.message).join(', ') : (resBody.error || "Could not save");
        throw new Error(errorMsg);
      }
      
      toast({ title: "Saved", description: "Navigation updated" });
      // Re-fetch to confirm persistence and re-sync form state
      const fresh = await fetch("/api/navigation", { cache: "no-store" }).then(r => r.json());
      setData(fresh);
    } catch (e: any) {
       toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
        setSaving(false);
    }
  }

  if (!data) {
     return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }
  
  return <NavEditor value={data} onChange={setData} onSave={onSave} saving={saving} pages={pages} />;
}
