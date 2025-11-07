
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getPageCount } from "@/lib/cms-server";

export default async function PagesListPage() {
  const { count } = await getPageCount();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild disabled>
          <Link href="/dadmin/pages/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Page (soon)
          </Link>
        </Button>
      </div>
       <div className="border rounded-lg p-12 text-center text-slate-500">
        <p>Page management is under construction.</p>
        <p className="text-sm">There are currently {count} page documents in Firestore.</p>
      </div>
    </div>
  );
}
