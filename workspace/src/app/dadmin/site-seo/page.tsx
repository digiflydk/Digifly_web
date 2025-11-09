
import type { Metadata } from "next";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";

// Optional: Admin page title
export const metadata: Metadata = {
  title: "Site & SEO",
};

export default async function Page() {
  return <SiteSeoForm />;
}
