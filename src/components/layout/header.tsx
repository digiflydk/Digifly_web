


"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import React, { useEffect, useState } from "react";
import type { NavLink } from "@/lib/types";
import { resolveCmsLink } from "@/lib/links";
import Image from "next/image";

type HeaderProps = {
  nav?: NavLink[];
  logo?: { src?: string, alt?: string, width?: number, height?: number } | null;
  siteTitle?: string | null;
};

export default function Header({ nav, logo, siteTitle }: HeaderProps) {
  const [path, setPath] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  
  const navLinks = nav ?? [];
  const contactLink = { id: 'contact', link: { label: 'Contact', type: 'internal', internalRef: 'contact', newTab: false } as const};

  const finalLogoUrl = logo?.src || "";
  const finalSiteTitle = siteTitle || siteConfig.name;

  const renderLink = (item: NavLink, isMobile = false) => {
    const { href, target, rel, label, isActive } = resolveCmsLink(item.link, path);
    const key = item.id || `${label}-${href}`;

    const commonClasses = isMobile 
      ? "text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
      : `text-sm font-medium text-[var(--color-graphite)] hover:text-[var(--color-blue)] ${isActive ? "text-[var(--color-blue)]" : ""}`;
    
    if (!href) {
      return (
        <span key={key} className={`${commonClasses} opacity-50 cursor-not-allowed`} aria-disabled="true">
          {label}
        </span>
      );
    }
    
    return (
      <Link
        key={key}
        href={href}
        target={target}
        rel={rel}
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
        className={commonClasses}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  const contactButtonLink = resolveCmsLink(contactLink.link);

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
                alt={logo?.alt || finalSiteTitle}
                width={logo?.width || 140}
                height={logo?.height || 28}
                priority
                className="h-7 w-auto object-contain"
              />
            ) : (
              <span className="header-brand text-[20px]">{finalSiteTitle}</span>
            )}
          </Link>
        </div>
        <nav className="header-nav hidden md:flex items-center gap-6">
          {navLinks.map((link, i) => renderLink({id: link.id ?? `header-link-${i}`, ...link}))}
        </nav>
        <div className="hidden md:flex">
             {contactButtonLink.href && (
                <Link href={contactButtonLink.href}>
                  <Button>Contact Us</Button>
                </Link>
             )}
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
                        <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                            {finalLogoUrl ? (
                                <Image
                                    src={finalLogoUrl}
                                    alt={logo?.alt || finalSiteTitle}
                                    width={120}
                                    height={32}
                                    priority
                                    className="h-8 w-auto object-contain"
                                />
                            ) : (
                                <span className="font-headline text-lg font-bold text-primary">{finalSiteTitle}</span>
                            )}
                        </Link>
                        <nav className="flex flex-col gap-4">
                            {[...navLinks, contactLink].map((link, i) => renderLink({id: link.id ?? `header-link-mobile-${i}`, ...link}, true))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
