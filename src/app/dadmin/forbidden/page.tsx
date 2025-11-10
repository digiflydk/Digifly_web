
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-md">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have the required permissions to view this page. Superadmin access is required.
           <br />
          <Link href="/dadmin" className="underline mt-4 inline-block">Return to Dashboard</Link>
        </AlertDescription>
      </Alert>
    </div>
  );
}
