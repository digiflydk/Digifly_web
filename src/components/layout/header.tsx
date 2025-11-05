import { getNavigation } from "@/lib/cms";
import Link from "next/link";
import { headers } from "next/headers";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default async function Header() {
  const nav = await getNavigation();
  const path = (headers().get("x-pathname") || "/").split("?")[0];

  const navLinks = [
    ...nav.header,
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="font-semibold">Digifly</Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.header.map(link => {
            const isActive = path === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`hover:text-[var(--color-blue)] ${isActive ? "text-[var(--color-blue)]" : "text-[var(--color-graphite)]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex">
             <Button href="/contact" variant="secondary">Contact Us</Button>
        </div>

        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0" aria-label="Open menu">
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
      </div>
    </header>
  );
}
