
import HomepageEditor from "@/components/cms/forms/HomepageEditor";
import { getHomepage as getHomepageServer } from "@/lib/cms-server";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";

export const dynamic = 'force-dynamic';

export default async function HomepageAdminPage() {
    // Fetch data on the server during the initial render
    const result = await getHomepageServer({ debug: true });
    const data = result.data ?? defaultHomepage;

    return <HomepageEditor initialData={data} />;
}
