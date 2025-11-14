
import HomepageEditor from "@/components/cms/forms/HomepageEditor";
import { getHomepage as getHomepageServer } from "@/lib/cms-server";
import { defaultHomepage } from "@/data/defaults";
import type { HomePage } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function HomepageAdminPage() {
    // DGF-371: Add catch block to prevent crashes if CMS fetch fails
    const result = await getHomepageServer({ debug: true }).catch((e) => {
        console.error("[dadmin/homepage] Failed to load initial data:", e);
        return { ok: false, data: defaultHomepage };
    });
    
    // Ensure we always have a valid HomePage object to pass down
    const data: HomePage = result?.ok ? result.data : defaultHomepage;

    return <HomepageEditor initialData={data} />;
}
