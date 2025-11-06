import AdminShell from "../_components/AdminShell";
import { getSiteSeo } from "@/lib/cms";
import { SiteSeoForm } from "@/components/cms/forms/SiteSeoForm";

export default async function SiteSeoPage() {
    const data = await getSiteSeo();
    return (
        <AdminShell title="Site & SEO" subtitle="Manage global site information and default SEO settings.">
            <div className="mt-8">
                <SiteSeoForm data={data} />
            </div>
        </AdminShell>
    );
}
