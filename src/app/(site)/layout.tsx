import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getNavigation, getDesign } from "@/lib/cms-server";
import { Brand } from "@/lib/types";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = await getNavigation();
  const design = await getDesign();
  const logo = design?.brand?.logo as Brand['logo'];

  return (
    <div className="flex min-h-screen flex-col">
      <Header nav={navigation?.header} logo={logo} />
      <main className="flex-1">{children}</main>
      <Footer columns={navigation?.footer?.columns} />
    </div>
  );
}
