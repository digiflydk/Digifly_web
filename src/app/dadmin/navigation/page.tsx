
"use client";

import { useEffect, useState } from "react";
import NavEditor from "./NavEditor";
import type { Navigation } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavigationPage() {
  const [data, setData] = useState<Navigation | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/navigation", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Could not load navigation data.");
        }
        setData(await res.json());
      } catch (e: any) {
        setError(e.message);
        toast({ title: "Load failed", description: e.message, variant: "destructive" });
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

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Could not save navigation data.");
      }

      toast({ title: "Saved", description: "Navigation updated" });
      // Re-fetch to confirm persistence and re-sync state
      const fresh = await fetch("/api/navigation", { cache: "no-store" }).then(r => r.json());
      setData(fresh);

    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return <div className="p-6 text-destructive">{error}</div>;
  }
  
  if (!data) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  return <NavEditor initialData={data} onSave={onSave} isSaving={saving} />;
}
