

import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { NavLink } from "@/lib/types";

type FooterColumn = {
  title: string;
  links: NavLink[];
};

export default function Footer({ columns }: { columns?: { title: string; links: NavLink[] }[] }) {
  if (!columns || columns.length === 0) {
    return (
      <footer className="mt-24 border-t">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-muted-foreground">
          Footer navigation not configured.
        </div>
        <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} {siteConfig.name} • 1.3.0 • DGF-212</div>
      </footer>
    );
  }

  return (
    <footer className="mt-24 border-t">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
            <Link href="/" className="font-headline text-lg font-bold text-primary">{siteConfig.name}</Link>
            <p className="text-sm mt-2 text-muted-foreground">{siteConfig.description}</p>
        </div>
        {columns.map(col => (
          <div key={col.title}>
            <div className="font-semibold mb-2">{col.title}</div>
            <ul className="space-y-1">
              {col.links.map(l => (
                <li key={l.href}><Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} {siteConfig.name} • 1.3.0 • DGF-212</div>
    </footer>
  );
}
