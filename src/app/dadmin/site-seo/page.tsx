
import type { Metadata } from "next";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";

export const metadata: Metadata = {
  title: "Site & SEO Settings",
};

export default function Page() {
  return <SiteSeoForm />;
}
