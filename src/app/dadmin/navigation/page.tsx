
import NavEditor from "./NavEditor";
import { getPublishedPagesList, getNavigation } from "@/lib/cms-server";

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  // Fetch initial data on the server and pass to the client component
  const [initialData, pages] = await Promise.all([
    getNavigation(),
    getPublishedPagesList()
  ]);

  return <NavEditor initialData={initialData} pages={pages} />;
}
