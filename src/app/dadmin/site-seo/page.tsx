
import { getSiteSeo } from "@/lib/cms";
import { SiteSeoForm } from "@/components/cms/forms/SiteSeoForm";

export default async function SiteSeoPage() {
    const data = await getSiteSeo();
    return (
        <div className="mt-8">
            <SiteSeoForm data={data} />
        </div>
    );
}
