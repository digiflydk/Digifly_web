
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getNavigation, getDesign, getSiteSeo } from "@/lib/cms-server";
import { siteConfig } from "@/config/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, design, site] = await Promise.all([getNavigation(), getDesign(), getSiteSeo()]);
  const logo = design?.brand?.logo;

  return (
    <div className="flex min-h-screen flex-col">
      <Header nav={navigation?.header} logoUrl={site.logo?.src} siteTitle={site.siteTitle} />
      <main className="flex-1" style={{ paddingTop: 'calc(var(--header-height, 64px) + env(safe-area-inset-top))' }}>{children}</main>
      <Footer columns={navigation?.footer?.columns} />
    </div>
  );
}
