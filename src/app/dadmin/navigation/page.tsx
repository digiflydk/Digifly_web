import AdminShell from "../_components/AdminShell";
import { getNavigation } from "@/lib/cms";
import { NavigationForm } from "@/components/cms/forms/NavigationForm";

export default async function NavigationPage() {
    const data = await getNavigation();
    return (
        <AdminShell title="Navigation" subtitle="Manage primary and footer menus.">
            <div className="mt-8">
                <NavigationForm data={data} />
            </div>
        </AdminShell>
    );
}
