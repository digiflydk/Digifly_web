
import { getHomePage } from "@/lib/cms";
import { HomepageForm } from "@/components/cms/forms/HomepageForm";

export default async function HomepageAdminPage() {
    const data = await getHomePage();
    return (
        <div className="mt-8">
            <HomepageForm data={data} />
        </div>
    );
}
