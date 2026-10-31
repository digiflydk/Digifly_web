"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
const links = [
  ["Hvad vi gør", "/#ydelser"],
  ["Vores arbejde", "/#cases"],
  ["Samarbejdet", "/#samarbejdet"],
  ["Om Digifly", "/about"],
];
export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header ref={header} className="site-header">
      <div className="wrap header-inner">
        <Link
          href="/"
          className="logo-link"
          aria-label="Digifly forside"
          onClick={() => setOpen(false)}
        >
          <img
            src="/brand/digifly-logo.png"
            alt="Digifly"
            width="1890"
            height="413"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Hovednavigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="button button-small"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            Tal med os <Arrow diagonal />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? "Luk" : "Menu"}
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav wrap"
          aria-label="Mobilnavigation"
        >
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <Arrow />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
