
"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import type { CurrentUser } from "@/lib/auth/serverAuth";
import { useRouter } from "next/navigation";

export function Topbar({ onMenuClick, user }: { onMenuClick: () => void, user: CurrentUser | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/dadmin/login');
    router.refresh();
  };
  
  const getInitials = (email?: string) => {
    if (!email) return 'AD';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="h-16 flex items-center justify-between md:justify-end px-4 sm:px-6 border-b border-slate-200 bg-white sticky top-0 z-10">
      <Button variant="ghost" className="h-10 w-10 p-0 md:hidden" aria-label="Open menu" onClick={onMenuClick}>
        <Menu />
        <span className="sr-only">Open menu</span>
      </Button>
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/" target="_blank">View Site</Link>
        </Button>
        <Button disabled>Publish</Button>
        <Avatar title={user?.email}>
          <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
        </Avatar>
         <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-5 w-5 text-slate-500" />
        </Button>
      </div>
    </header>
  );
}
