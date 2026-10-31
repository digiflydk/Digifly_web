import type { Metadata } from "next";
import {
  CasesSection,
  TestimonialsSection,
  ContactCta,
} from "@/components/marketing/sections";
import { casesIntro, siteUrl } from "@/lib/marketing";
export const metadata: Metadata = {
  title: "Vores arbejde · Udvalgte kundecases",
  alternates: siteUrl() ? { canonical: "/cases" } : undefined,
};
export default function CasesPage() {
  return (
    <>
      <section className="page-hero wrap">
        <p className="eyebrow">VORES ARBEJDE</p>
        <h1>
          Et indblik i <br /> vores arbejde.
        </h1>
        <p>{casesIntro}</p>
      </section>
      <CasesSection showHeading={false} />
      <TestimonialsSection />
      <ContactCta />
    </>
  );
}
