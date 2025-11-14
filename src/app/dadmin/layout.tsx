
export const runtime = "nodejs";

import AdminShell from "./_components/AdminShell";
import AdminFooter from "@/components/layout/AdminFooter";
import { getCurrentUser } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";

export default async function DadminLayout({ children }: { children: React.ReactNode; }) {
  let user = null;
  // Bypass auth check if disabled for development
  if (process.env.ADMIN_AUTH_DISABLED !== 'true') {
    user = await getCurrentUser();
    if (!user) {
      redirect("/dadmin/login");
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="flex-1">
        <AdminShell user={user}>
          {children}
        </AdminShell>
      </div>
      <AdminFooter />
    </div>
  );
}
