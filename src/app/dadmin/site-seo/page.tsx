import type { Metadata } from "next";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Site & SEO",
};

export default async function Page() {
  const initialData = await readSiteSettings();
  return <SiteSeoForm initialData={initialData} />;
}
