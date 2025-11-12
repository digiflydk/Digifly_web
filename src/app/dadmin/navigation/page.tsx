
"use client";

import { useEffect, useState } from "react";
import type { Navigation } from "@/lib/schemas";
import NavEditor from "./NavEditor";
import { toast } from "@/hooks/use-toast";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedPagesList } from "@/lib/cms-server";

type PageInfo = { id: string; title: string, path: string };

export default function NavigationPage() {
  const [data, setData] = useState<Navigation | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [navRes, pagesRes] = await Promise.all([
          fetch("/api/navigation", { cache: "no-store" }),
          getPublishedPagesList()
        ]);
        
        if (!navRes.ok) {
          throw new Error(`Failed to load navigation: ${navRes.statusText}`);
        }
        setData(await navRes.json());
        setPages(pagesRes);
      } catch (e: any) {
        toast({ title: "Load failed", description: e.message, variant: "destructive" });
        setData(defaultNavigation);
      }
    })();
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <NavEditor initialData={data} pages={pages} />;
}
