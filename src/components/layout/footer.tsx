import { getNavigation } from "@/lib/cms";
import Link from "next/link";

export default async function Footer() {
  const nav = await getNavigation();
  return (
    <footer className="mt-24 border-t">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">Digifly</div>
          <div className="text-sm mt-2">{nav.footer.company.address}</div>
          <a href={`mailto:${nav.footer.company.email}`} className="text-sm block">{nav.footer.company.email}</a>
          <div className="text-sm">{nav.footer.company.phone}</div>
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1">
            {nav.footer.links.map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Social</div>
          <ul className="space-y-1">
            {nav.footer.social.map(l => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-[var(--color-graphite)]/70 py-4">© {new Date().getFullYear()} Digifly</div>
    </footer>
  );
}
