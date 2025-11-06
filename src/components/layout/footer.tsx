
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { NavLink } from "@/lib/types";

type FooterColumn = {
  title: string;
  links: NavLink[];
};

export default function Footer({ columns }: { columns?: NavLink[] }) {
  if (!columns || columns.length === 0) {
    return (
      <footer className="mt-24 border-t">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-muted-foreground">
          Footer navigation not configured.
        </div>
        <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} {siteConfig.name} • 1.2.0 • DGF-076</div>
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
        {/* This structure assumes a flat list for simplicity, but your data has columns.
            Let's adapt to the `columns` prop structure if it's an array of objects.
            However, the current Navigation type has footer as a flat array.
            We will adapt to what is likely intended: columns.
        */}
        {columns.map(l => (
          <div key={l.href}>
            <div className="font-semibold mb-2">{l.label}</div>
            {/* Assuming links are grouped under a title, which might need schema adjustment.
                For now, rendering a single link per "column".
            */}
            <ul className="space-y-1">
                <li><Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors">{l.label}</Link></li>
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} {siteConfig.name} • 1.2.0 • DGF-076</div>
    </footer>
  );
}
