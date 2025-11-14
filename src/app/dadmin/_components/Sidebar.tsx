
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Link2, LayoutTemplate, Briefcase, FileText, Wrench, Beaker, DownloadCloud, FileJson, Database, History } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { CurrentUser } from "@/lib/auth/serverAuth";

const menuItems = [
  { href: "/dadmin", label: "Dashboard", icon: Home },
  { href: "/dadmin/site-seo", label: "Site & SEO", icon: Search },
  { href: "/dadmin/navigation", label: "Navigation", icon: Link2 },
  { href: "/dadmin/homepage", label: "Homepage", icon: LayoutTemplate },
  { href: "/dadmin/cases", label: "Case Studies", icon: Briefcase },
  { href: "/dadmin/pages", label: "Pages", icon: FileText },
];

const devMenuItems = [
    { href: "/dadmin/developer/docs", label: "Docs & Dumps", icon: FileText },
    { href: "/dadmin/developer/tests", label: "Playwright Tests", icon: Beaker },
    { href: "/dadmin/developer/audit-logs", label: "Audit Logs", icon: History },
    { href: "/dadmin/dev/api-map", label: "API Map", icon: Wrench },
    { href: "/dadmin/api-explorer", label: "API Explorer", icon: Beaker },
    { href: "/dadmin/dev/cms-snapshots", label: "CMS Snapshots", icon: DownloadCloud },
];

function NavContent({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  // Show dev menu if user has 'superadmin' role, or always in public mode
  const showDevMenu = user?.role === 'superadmin' || process.env.NEXT_PUBLIC_AUTH_MODE === 'public';
  
  const renderLink = (item: any) => {
    const isActive = (item.href === '/dadmin' && pathname === item.href) || (item.href !== '/dadmin' && pathname.startsWith(item.href));
    return (
        <li key={item.href}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors h-[44px]",
            isActive
              ? "bg-violet-50 text-violet-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            item.disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-disabled={item.disabled}
          onClick={(e) => item.disabled && e.preventDefault()}
          aria-current={isActive ? "page" : undefined}
          // For download links, we don't want Next.js pre-fetching
          prefetch={item.href.startsWith('/api') || item.href.startsWith('/dadmin/developer/') ? false : undefined}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      </li>
    )
  }

  return (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/dadmin" className="font-bold text-lg">{siteConfig.name} Admin</Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map(renderLink)}
        </ul>
        {showDevMenu && (
          <div className="mt-6">
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Developer</p>
              <ul className="space-y-1 mt-2">
                  {devMenuItems.map(renderLink)}
              </ul>
          </div>
        )}
      </nav>
    </>
  )
}

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen, user }: { mobileMenuOpen: boolean, setMobileMenuOpen: (open: boolean) => void, user: CurrentUser | null }) {
  return (
    <>
        {/* Mobile */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="w-64 p-0 bg-white md:hidden">
                <SheetHeader>
                  <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                </SheetHeader>
                <NavContent user={user} />
            </SheetContent>
        </Sheet>
        
        {/* Desktop */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 min-h-screen flex-col hidden md:flex">
            <NavContent user={user} />
        </aside>
    </>
  );
}
