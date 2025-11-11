import { getNavigation } from "@/lib/cms-server";
import NavEditor from "./NavEditor";

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  const nav = await getNavigation();
  
  return (
    <div className="space-y-8">
      <NavEditor initialData={nav} />
    </div>
  );
}
