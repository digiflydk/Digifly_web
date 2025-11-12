
import HomepageEditor from "@/components/cms/forms/HomepageEditor";
import { getHomepage as getHomepageServer } from "@/lib/cms-server";

export const dynamic = 'force-dynamic';

export default async function HomepageAdminPage() {
    // Fetch data on the server during the initial render
    const result = await getHomepageServer({ debug: true });
    const data = result.data;

    return <HomepageEditor initialData={data} />;
}
