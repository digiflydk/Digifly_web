
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  
  return (
    <header className="h-16 flex items-center justify-between md:justify-end px-4 sm:px-6 border-b border-slate-200 bg-white sticky top-0 z-10">
      <Button variant="ghost" className="h-10 w-10 p-0 md:hidden" aria-label="Open menu" onClick={onMenuClick}>
        <Menu />
        <span className="sr-only">Open menu</span>
      </Button>
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/" target="_blank">View Site</Link>
        </Button>
        <Button disabled>Publish</Button>
      </div>
    </header>
  );
}
