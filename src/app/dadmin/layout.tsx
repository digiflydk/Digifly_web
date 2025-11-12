
export const runtime = "nodejs";
import AdminShell from "./_components/AdminShell";
import AdminFooter from "@/components/layout/AdminFooter";
import { getCurrentUser } from "@/lib/auth/serverAuth";
import { redirect } from "next/navigation";

export default async function DadminLayout({ children }: { children: React.ReactNode; }) {
  const user = await getCurrentUser();
  
  if (!user) {
    // This is a server-side check. Middleware should also be active.
    redirect("/dadmin/login");
  }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 font-sans">
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <AdminShell user={user}>
                    {children}
                </AdminShell>
            </div>
            <AdminFooter />
        </div>
      </body>
    </html>
  );
}
