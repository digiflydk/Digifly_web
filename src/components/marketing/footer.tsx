import Link from "next/link";
export function MarketingFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <div>
          <Link href="/" aria-label="Digifly forside">
            <img
              src="/brand/digifly-logo.png"
              alt="Digifly"
              width="1890"
              height="413"
            />
          </Link>
          <p>Flow. Digitalize. Scale.</p>
        </div>
        <p className="footer-statement">
          Software, AI og rådgivning <br />
          med forretningen som udgangspunkt.
        </p>
        <nav aria-label="Footernavigation">
          <Link href="/services">Hvad vi gør</Link>
          <Link href="/cases">Vores arbejde</Link>
          <Link href="/about">Om Digifly</Link>
          <Link href="/contact">Kontakt</Link>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Digifly</span>
        <div>
          <Link href="/privacy">Privatliv</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
        <span>Bygget til det næste.</span>
      </div>
    </footer>
  );
}
