import type { Metadata } from "next";
import { ProductsSection, ContactCta } from "@/components/marketing/sections";
import { siteUrl } from "@/lib/marketing";
export const metadata: Metadata = {
  title: "Egne produkter",
  alternates: siteUrl() ? { canonical: "/cases" } : undefined,
};
export default function CasesPage() {
  return (
    <>
      <div className="page-hero wrap">
        <p className="eyebrow">DET VI BYGGER</p>
        <h1>
          Vi kender også <br />
          arbejdet indefra.
        </h1>
        <p>
          Orderfly og Opsfly er egne produkter, hvor vi arbejder med digitale
          kundeoplevelser og operationelle arbejdsgange.
        </p>
      </div>
      <ProductsSection />
      <ContactCta />
    </>
  );
}
