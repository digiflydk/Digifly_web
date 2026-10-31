import type { Metadata } from "next";
import { ProcessSection, ContactCta } from "@/components/marketing/sections";
import { siteUrl } from "@/lib/marketing";
export const metadata: Metadata = {
  title: "Om Digifly",
  alternates: siteUrl() ? { canonical: "/about" } : undefined,
};
export default function AboutPage() {
  return (
    <>
      <section className="page-hero wrap">
        <p className="eyebrow">VORES PERSPEKTIV</p>
        <h1>
          Teknologi skal kunne <br />
          <span className="indigo">mærkes i hverdagen.</span>
        </h1>
        <p>Vi forbinder forretningsforståelse, software og AI.</p>
      </section>
      <section className="wrap about-statement">
        <p>
          Digifly kombinerer forretningsforståelse, teknologi og rådgivning. Vi
          hjælper virksomheder med at udvikle software, implementere systemer og
          undersøge muligheder for deres næste skridt.
        </p>
        <p>
          Opgaverne spænder fra AI og digitale arbejdsgange til fondsresearch og
          forberedelse af produkter til nye markeder. Fælles for arbejdet er
          ønsket om at gøre komplekse spørgsmål konkrete og skabe et brugbart
          grundlag for handling.
        </p>
        <p>
          Vores vision er at gøre teknologi og viden til praktiske redskaber for
          vækst. Vi starter med at forstå forretningen og arbejder hen imod
          løsninger, der kan bruges og udvikles i hverdagen.
        </p>
        <p>Vi er nysgerrige på nye muligheder og konkrete i det, vi leverer.</p>
      </section>
      <section className="wrap brand-values">
        <article>
          <span>01</span>
          <h2>Flow.</h2>
          <p>Få mennesker, data og arbejdsgange til at hænge sammen.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Digitalize.</h2>
          <p>
            Omsæt manuelle processer og nye idéer til brugbare digitale
            løsninger.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Scale.</h2>
          <p>Skab et teknisk grundlag, som kan udvikle sig med forretningen.</p>
        </article>
      </section>
      <ProcessSection />
      <ContactCta />
    </>
  );
}
