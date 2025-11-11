
import HomepageEditor from "@/components/cms/forms/HomepageEditor";
import { getHomepage } from "./actions";

export const dynamic = 'force-dynamic';

export default async function HomepageAdminPage() {
    const result = await getHomepage({ debug: true });

    // The editor now handles the alert, we just need to pass the data
    const data = result.data;

    return <HomepageEditor initialData={data} />;
}
