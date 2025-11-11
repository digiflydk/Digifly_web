
import { getSiteSettings } from "@/lib/cms-server";
import SiteSeoForm from "@/components/dadmin/site-seo/SiteSeoForm";
import type { Metadata } from 'next';
import { buildSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Site & SEO Settings',
    description: 'Manage global site configuration.',
    noIndex: true,
  });
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const settings = await getSiteSettings().catch(() => null);
  return <SiteSeoForm initialData={settings} />;
}
