
"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import React, { useEffect, useState } from "react";
import { NavLink } from "@/lib/types";
import Image from "next/image";

type HeaderProps = {
  nav?: NavLink[];
  logoUrl?: string | null;
  siteTitle?: string | null;
};

export default function Header({ nav, logoUrl, siteTitle }: HeaderProps) {
  const [path, setPath] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  
  const navLinks = nav ? [
    ...nav,
    { label: 'Contact', href: '/contact' },
  ] : [{ label: 'Contact', href: '/contact' }];

  const finalLogoUrl = logoUrl || "/logo.svg";
  const finalSiteTitle = siteTitle || siteConfig.name;

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      style={{ height: 'var(--header-height, 64px)', paddingTop: 'env(safe-area-inset-top)' }}
      aria-label="Site Header"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-full">
        <div className="flex items-center min-w-[140px]">
          <Link href="/" className="header-brand text-[20px]" aria-label={`${finalSiteTitle} home`}>
            {finalLogoUrl ? (
              <Image
                src={finalLogoUrl}
                alt={finalSiteTitle}
                width={140}
                height={28}
                priority
                className="h-7 w-auto object-contain"
              />
            ) : (
              <span className="header-brand text-[20px]">{finalSiteTitle}</span>
            )}
          </Link>
        </div>
        <nav className="header-nav hidden md:flex items-center gap-6">
          {nav?.map(link => {
            const isActive = path === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-medium text-[var(--color-graphite)] hover:text-[var(--color-blue)] ${isActive ? "text-[var(--color-blue)]" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex">
             <Link href="/contact">
              <Button variant="secondary">Contact Us</Button>
             </Link>
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
                            {finalSiteTitle}
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
