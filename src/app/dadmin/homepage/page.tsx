


import { HomepageForm } from "@/components/cms/forms/HomepageForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { getHomepage, saveHomepage } from "./actions";


export default async function HomepageAdminPage() {
    const result = await getHomepage();

    if (!result.ok && !result.data) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Failed to Load Homepage Data</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
            </Alert>
        );
    }
    
    // We can still render the form with the best-effort data even if validation fails
    const data = result.data;

    return (
      <>
        {result.issues && (
            <Alert variant="destructive" className="mb-4">
                 <Terminal className="h-4 w-4" />
                <AlertTitle>Data Validation Issues</AlertTitle>
                <AlertDescription>
                    Some fields have validation errors but have been loaded with default values. Saving will fix them.
                    <pre className="mt-2 text-xs">{JSON.stringify(result.issues, null, 2)}</pre>
                </AlertDescription>
            </Alert>
        )}
        <HomepageForm data={data} onSave={saveHomepage} />
      </>
    );
}
