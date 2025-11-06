import AdminShell from "../_components/AdminShell";
import { getHomePage } from "@/lib/cms";
import { HomepageForm } from "@/components/cms/forms/HomepageForm";

export default async function HomepageAdminPage() {
    const data = await getHomePage();
    return (
        <AdminShell title="Homepage" subtitle="Edit the content for your site's main landing page.">
            <div className="mt-8">
                <HomepageForm data={data} />
            </div>
        </AdminShell>
    );
}
