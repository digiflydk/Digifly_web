"use client";
import { getNavigation } from "@/lib/cms-client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import React, { useEffect, useState } from "react";
import { NavLink, Brand } from "@/lib/types";
import Image from "next/image";
import { getDesign } from "@/lib/cms-client";

type NavProps = {
  header: NavLink[];
};


function HeaderClient({ nav, logo }: { nav: NavProps, logo?: Brand['logo'] }) {
  const [elevated, setElevated] = useState(false);
  const [path, setPath] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll(); // run on mount
    window.addEventListener("scroll", onScroll, { passive: true });

    // Since this is a client component, we can get the path here
    setPath(window.location.pathname);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  const navLinks = nav?.header ? [
    ...nav.header,
    { label: 'Contact', href: '/contact' },
  ] : [{ label: 'Contact', href: '/contact' }];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-150 ${elevated ? "header-elevated" : "border-transparent"}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center min-w-[140px]">
          <Link href="/" className="header-brand text-[20px]" aria-label="Digifly home">
            {logo?.src ? (
              <Image
                src={logo.src}
                alt={logo.alt || 'Digifly'}
                width={logo.width || 140}
                height={logo.height || 24}
                priority
              />
            ) : (
              <span className="header-brand text-[20px]">{siteConfig.name}</span>
            )}
          </Link>
        </div>
        <nav className="header-nav hidden md:flex items-center gap-6">
          {nav?.header?.map(link => {
            const isActive = path === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-[var(--color-graphite)] hover:text-[var(--color-blue)] ${isActive ? "text-[var(--color-blue)]" : ""}`}
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
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0" aria-label="Open menu" data-menu-trigger>
                        <Menu />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-6 pt-12">
                        <Link href="/" className="font-headline text-lg font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>
                            {siteConfig.name}
                        </Link>
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(link => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={() => setMobileMenuOpen(false)}
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

export default function Header() {
    const [nav, setNav] = useState<NavProps | null>(null);
    const [logo, setLogo] = useState<Brand['logo'] | undefined>(undefined);
  
    useEffect(() => {
      async function fetchData() {
        const [navigation, design] = await Promise.all([
            getNavigation(),
            getDesign()
        ]);
        if (navigation) {
          setNav(navigation);
        }
        if (design?.brand?.logo) {
            setLogo(design.brand.logo);
        }
      }
      fetchData();
    }, []);
  
    if (!nav) {
      return (
        <header className="sticky top-0 z-50 border-b">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
            <Link href="/" className="header-brand text-[20px]">{siteConfig.name}</Link>
          </div>
        </header>
      )
    }

    return <HeaderClient nav={nav} logo={logo} />;
  }
