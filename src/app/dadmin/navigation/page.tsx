
import { getNavigation } from "@/lib/cms-server";
import { NavEditor } from "./NavEditor";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  const nav = await getNavigation() ?? defaultNavigation;
  
  return (
    <div className="space-y-8">
      <NavEditor 
          title="Primary Navigation"
          items={nav.header}
          onSaveKey="header"
          initialData={nav}
      />
      <NavEditor 
          title="Footer Navigation"
          description="Manage the first column of links in the footer."
          items={nav.footer.columns[0]?.links ?? []}
          onSaveKey="footer"
          initialData={nav}
      />
    </div>
  );
}
