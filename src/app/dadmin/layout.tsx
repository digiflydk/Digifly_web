
"use client";
import AdminShell from "./_components/AdminShell";
import { usePathname } from "next/navigation";

export default function DadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isRootDadmin = pathname === '/dadmin';
  return (
    <html>
      <body className="bg-slate-50 text-slate-900 font-sans">
        {isRootDadmin ? (
            children
        ) : (
            <AdminShell title="Admin">{children}</AdminShell>
        )}
      </body>
    </html>
  );
}
