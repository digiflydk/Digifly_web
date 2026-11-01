import type { Metadata } from "next";
import { ServicesSection, ContactCta } from "@/components/marketing/sections";
import { AiWorkflow } from "@/components/marketing/ai-workflow";
import { siteUrl } from "@/lib/marketing";
export const metadata: Metadata = {
  title: "Systemimplementering, udvikling og AI",
  alternates: siteUrl() ? { canonical: "/services" } : undefined,
};
export default function ServicesPage() {
  return (
    <>
      <div className="page-hero wrap">
        <p className="eyebrow">HVAD VI GØR</p>
        <h1>
          Fra en god idé <br />
          til en løsning, der virker.
        </h1>
        <p>
          Systemimplementering, softwareudvikling og AI, der forbinder den daglige drift med jeres næste vækstfase.
        </p>
      </div>
      <ServicesSection />
      <AiWorkflow />
      <ContactCta />
    </>
  );
}
