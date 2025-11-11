
import SiteSeoForm from "@/components/cms/forms/SiteSeoForm";
import { readSiteSettings } from "@/lib/cms-server";

export default async function Page() {
  const settings = await readSiteSettings().catch(() => null);
  return <SiteSeoForm initialData={settings} />;
}
