
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Link2, LayoutTemplate, Briefcase, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dadmin", label: "Dashboard", icon: Home },
  { href: "/dadmin/site-seo", label: "Site & SEO", icon: Search },
  { href: "/dadmin/navigation", label: "Navigation", icon: Link2 },
  { href: "/dadmin/homepage", label: "Homepage", icon: LayoutTemplate },
  { href: "/dadmin/cases", label: "Case Studies", icon: Briefcase },
  { href: "/dadmin/pages", label: "Pages", icon: FileText, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/dadmin" className="font-bold text-lg">{siteConfig.name} Admin</Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const isActive = (item.href === '/dadmin' && pathname === item.href) || (item.href !== '/dadmin' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={item.disabled}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
