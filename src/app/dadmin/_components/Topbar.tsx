import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export function Topbar() {
  return (
    <header className="h-16 flex items-center justify-end px-6 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/" target="_blank">View Site</Link>
        </Button>
        <Button disabled>Publish</Button>
        <Avatar>
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
