import Link from 'next/link';
import { getNavigation } from '@/lib/cms';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default async function Header() {
  const nav = await getNavigation();

  const navLinks = [
    ...nav.header,
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-headline text-lg font-bold text-primary">
          {siteConfig.name}
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.header.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="outline">
                <Link href="/contact">Contact Us</Link>
            </Button>
        </div>

        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-6 pt-12">
                        <Link href="/" className="font-headline text-lg font-bold text-primary">
                            {siteConfig.name}
                        </Link>
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(link => (
                                <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                                >
                                {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </Container>
    </header>
  );
}
