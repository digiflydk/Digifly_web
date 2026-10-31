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
          Vi arbejder med både egne produkter og udvikling for virksomheder, der
          vil gøre en idé til virkelighed eller få mere ud af deres digitale
          løsninger.
        </p>
        <p>
          Vores vision er at gøre teknologi til et praktisk redskab for vækst.
          Det begynder med at forstå menneskerne og arbejdsgangene bag opgaven
          og fortsætter med løsninger, der kan bruges, vedligeholdes og
          udvikles.
        </p>
        <p>Vi er nysgerrige på nye muligheder og konkrete i det, vi bygger.</p>
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
