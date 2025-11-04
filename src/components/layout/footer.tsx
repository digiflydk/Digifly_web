import { getNavigation } from '@/lib/cms';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/layout/container';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';

export default async function Footer() {
  const nav = await getNavigation();
  return (
    <footer className="mt-24 border-t border-border/40 py-10">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-headline text-lg font-bold text-primary">
                {siteConfig.name}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Strategy, Software & Automation with AI.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Company</h3>
            <ul className="space-y-2">
              {nav.header.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
               <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                </li>
            </ul>
          </div>
          <div>
          <h3 className="font-semibold text-foreground mb-2">Legal</h3>
            <ul className="space-y-2">
              {nav.footer.links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/40 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} {nav.footer.company.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                {nav.footer.social.map(l => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin size={18} />
                        <span className="sr-only">{l.label}</span>
                    </a>
                ))}
            </div>
        </div>
      </Container>
    </footer>
  );
}
