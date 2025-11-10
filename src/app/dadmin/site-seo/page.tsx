
import type { Metadata } from "next";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";
import { getSiteSettings } from "./actions";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Site & SEO",
};

export default async function Page() {
  const initialData = await getSiteSettings();
  return <SiteSeoForm initialData={initialData} />;
}
