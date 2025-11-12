

import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { NavLink } from "@/lib/types";
import { resolveCmsLink } from "@/lib/links";

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
        <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} {siteConfig.name} • 1.3.25 • DGF-342</div>
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
        {columns.map((col, i) => (
          <div key={col.title ?? `footer-col-${i}`}>
            <div className="font-semibold mb-2">{col.title}</div>
            <ul className="space-y-1">
              {col.links.map((l, j) => {
                const { href, label, target, rel } = resolveCmsLink(l.link);
                if (!href) return (
                  <li key={l.id ?? `footer-link-${j}`}><span className="text-muted-foreground/50 cursor-not-allowed">{label || 'Empty Link'}</span></li>
                );
                return (
                  <li key={l.id ?? `footer-link-${j}`}><Link href={href} target={target} rel={rel} className="text-muted-foreground hover:text-primary transition-colors">{label}</Link></li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} {siteConfig.name} • 1.3.25 • DGF-342</div>
    </footer>
  );
}
