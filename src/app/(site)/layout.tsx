
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getNavigation, getDesign } from "@/lib/cms-server";
import { Brand } from "@/lib/types";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, design] = await Promise.all([getNavigation(), getDesign()]);
  const logo = design?.brand?.logo;

  return (
    <div className="flex min-h-screen flex-col">
      <Header nav={navigation?.header} logo={logo} />
      <main className="flex-1 pt-[var(--header-height,64px)]">{children}</main>
      <Footer columns={navigation?.footer?.columns} />
    </div>
  );
}
