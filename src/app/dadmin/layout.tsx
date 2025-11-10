
import AdminShell from "./_components/AdminShell";
import AdminFooter from "@/components/layout/AdminFooter";

export default async function DadminLayout({ children }: { children: React.ReactNode; }) {
  // Auth is disabled, so we pass a null user.
  const user = null;

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
