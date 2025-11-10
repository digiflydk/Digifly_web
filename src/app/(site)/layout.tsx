
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getNavigation } from "@/lib/cms-server";
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";
import { orgJsonLd, localBusinessJsonLd } from "@/lib/structured-data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, site] = await Promise.all([getNavigation(), readSiteSettings()]);
  const jsonLdBlocks = site ? [orgJsonLd(site), localBusinessJsonLd(site)].filter(Boolean) : [];

  return (
    <div className="flex min-h-screen flex-col">
      {jsonLdBlocks.map((b, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />
      ))}
      <Header 
        nav={navigation?.header} 
        logo={{ 
          src: site?.general?.logoUrl ?? '/logo.svg', 
          alt: site?.general?.title ?? 'Digifly' 
        }} 
        siteTitle={site?.general?.title} 
      />
      <main className="flex-1" style={{ paddingTop: 'calc(var(--header-height, 64px) + env(safe-area-inset-top))' }}>{children}</main>
      <Footer columns={navigation?.footer?.columns} />
    </div>
  );
}
