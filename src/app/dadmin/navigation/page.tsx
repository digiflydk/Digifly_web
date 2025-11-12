
import { getNavigation } from "@/lib/server/cms-actions";
import NavEditor from "./NavEditor";
import { getPublishedPagesList } from "@/lib/cms-server";

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  const [initialData, pages] = await Promise.all([
    getNavigation(),
    getPublishedPagesList()
  ]);

  return <NavEditor initialData={initialData} pages={pages} />;
}
