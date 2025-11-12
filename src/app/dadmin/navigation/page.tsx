
"use client";

import { useEffect, useState } from "react";
import type { Navigation } from "@/lib/schemas";
import NavEditor from "./NavEditor";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

export default function NavigationPage() {
  const [data, setData] = useState<Navigation | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/navigation", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load navigation data: ${res.statusText}`);
        }
        setData(await res.json());
      } catch(e: any) {
        toast({ title: "Load failed", description: e.message, variant: "destructive" });
        setData(defaultNavigation); // Fallback to defaults on load failure
      }
    })();
  }, []);

  async function onSave() {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Could not save navigation.");
      }

      toast({ title: "Saved", description: "Navigation updated." });
      
      // Re-fetch to confirm persistence and re-sync form state
      const freshData = await fetch("/api/navigation", { cache: "no-store" }).then(r => r.json());
      setData(freshData);

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

  return <NavEditor value={data} onChange={setData} onSave={onSave} saving={saving} />;
}
