import Link from "next/link";
import type { Metadata } from "next";
import { Arrow } from "@/components/marketing/icons";
import { FlowArt } from "@/components/marketing/flow-art";
import { AiWorkflow } from "@/components/marketing/ai-workflow";
import {
  ServicesSection,
  ProductsSection,
  ProcessSection,
  PerspectiveSection,
  FaqSection,
  ContactCta,
} from "@/components/marketing/sections";
import { siteUrl } from "@/lib/marketing";
export const metadata: Metadata = {
  alternates: siteUrl() ? { canonical: "/" } : undefined,
};
export default function HomePage() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-dot" /> AI. SOFTWARE. FORRETNING.
          </p>
          <h1>
            <span>Flow.</span>
            <span>Digitalize.</span>
            <span className="indigo">Scale.</span>
          </h1>
          <h2>Gør AI til en del af forretningen.</h2>
          <p className="hero-intro">
            Vi bygger digitale produkter, forbinder systemer og automatiserer
            arbejdsgange. Med jeres forretning som udgangspunkt.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Tal med os <Arrow diagonal />
            </Link>
            <Link className="text-link" href="#produkter">
              Se hvad vi bygger <Arrow />
            </Link>
          </div>
        </div>
        <FlowArt />
      </section>
      <div className="wrap capabilities-strip">
        <span>Forretningsforståelse</span>
        <b aria-hidden="true">+</b>
        <span>Digital udvikling</span>
        <b aria-hidden="true">+</b>
        <span>AI i praksis</span>
        <span className="strip-end">
          FRA IDÉ TIL DRIFT <Arrow diagonal />
        </span>
      </div>
      <ServicesSection />
      <ProductsSection />
      <AiWorkflow />
      <ProcessSection />
      <PerspectiveSection />
      <FaqSection />
      <ContactCta />
    </>
  );
}
