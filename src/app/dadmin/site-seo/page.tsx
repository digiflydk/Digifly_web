
import type { Metadata } from "next";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";

export const metadata: Metadata = {
  title: "Site & SEO",
};

export default async function Page() {
  return <SiteSeoForm />;
}
