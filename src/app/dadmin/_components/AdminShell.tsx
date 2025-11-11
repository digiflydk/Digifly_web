
"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useState } from "react";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/dadmin": { title: "Dashboard", subtitle: "Overview of your site's content." },
  "/dadmin/site-seo": { title: "Site & SEO", subtitle: "Manage global site information and default SEO settings." },
  "/dadmin/navigation": { title: "Navigation", subtitle: "Manage primary and footer menus." },
  "/dadmin/homepage": { title: "Homepage", subtitle: "Edit the content for your site's main landing page." },
  "/dadmin/cases": { title: "Case Studies", subtitle: "Manage your case studies." },
  "/dadmin/pages": { title: "Pages", subtitle: "Manage your site's pages." },
  "/dadmin/docs": { title: "Developer Docs", subtitle: "Live view of markdown files from the /docs directory." },
  "/dadmin/developer/predeploy": { title: "Pre-deploy Checks", subtitle: "Run checks for common release blockers."},
  "/dadmin/developer/tests": { title: "Playwright Tests", subtitle: "View Playwright test artifacts and reports." },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Find the most specific match for the title
  const matchedPath = Object.keys(titles).sort((a,b) => b.length - a.length).find(p => pathname.startsWith(p));
  const { title, subtitle } = titles[matchedPath || '/dadmin'] || { title: "Admin" };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="flex-1 flex flex-col">
          <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="max-w-7xl mx-auto p-4 sm:p-6 w-full">
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </header>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
