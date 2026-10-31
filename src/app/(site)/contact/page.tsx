import type { Metadata } from "next";
import { MarketingContactForm } from "@/components/marketing/contact-form";
import { contactEnabled } from "@/lib/contact";
import { siteUrl } from "@/lib/marketing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kontakt",
  alternates: siteUrl() ? { canonical: "/contact" } : undefined,
};
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const params = await searchParams;
  const allowed = ["Orderfly", "Opsfly"];
  const subject = allowed.includes(params.subject || "") ? params.subject : "";
  return (
    <section className="wrap contact-page">
      <div>
        <p className="eyebrow">JERES NÆSTE SKRIDT</p>
        <h1>
          Hvad skal kunne <br />
          lade sig gøre hos jer?
        </h1>
        <p className="intro-text">
          Fortæl os om den idé, udfordring eller arbejdsgang, I vil tage videre.
          Så tager vi en samtale om mulighederne og et konkret første skridt.
        </p>
        <div className="contact-aside">
          <h2>I behøver ikke have alle svarene.</h2>
          <p>
            En konkret udfordring er et godt sted at starte. Vi hjælper med at
            finde ud af, hvad der er værd at bygge først.
          </p>
        </div>
      </div>
      <MarketingContactForm enabled={contactEnabled()} subject={subject} />
    </section>
  );
}
