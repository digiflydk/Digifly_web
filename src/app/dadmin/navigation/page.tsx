
import { getNavigation } from "@/lib/cms";
import { NavigationForm } from "@/components/cms/forms/NavigationForm";

export default async function NavigationPage() {
    const data = await getNavigation();
    return (
        <div className="mt-8">
            <NavigationForm data={data} />
        </div>
    );
}
