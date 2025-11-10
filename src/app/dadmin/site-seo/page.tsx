
import type { Metadata } from "next";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";
import { getSiteSettings } from "@/lib/cms-server";
import { SITE_DEFAULTS } from "@/lib/defaults/siteDefaults";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Site & SEO",
};

export default async function Page() {
  const settings = await getSiteSettings();
  return <SiteSeoForm initialData={settings ?? SITE_DEFAULTS} />;
}
