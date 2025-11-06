
"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/dadmin": { title: "Dashboard", subtitle: "Overview of your site's content." },
  "/dadmin/site-seo": { title: "Site & SEO", subtitle: "Manage global site information and default SEO settings." },
  "/dadmin/navigation": { title: "Navigation", subtitle: "Manage primary and footer menus." },
  "/dadmin/homepage": { title: "Homepage", subtitle: "Edit the content for your site's main landing page." },
  "/dadmin/cases": { title: "Case Studies", subtitle: "Manage your case studies." },
  "/dadmin/pages": { title: "Pages", subtitle: "Manage your site's pages." },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { title, subtitle } = titles[pathname] || { title: "Admin" };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="max-w-7xl mx-auto p-6">
            <header className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </header>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
