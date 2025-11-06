
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getNavigation, getSiteSeo } from "@/lib/cms-server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, site] = await Promise.all([getNavigation(), getSiteSeo()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header nav={navigation?.header} logoUrl={site.logoUrl} siteTitle={site.siteTitle} />
      <main className="flex-1" style={{ paddingTop: 'calc(var(--header-height, 64px) + env(safe-area-inset-top))' }}>{children}</main>
      <Footer columns={navigation?.footer?.columns} />
    </div>
  );
}
