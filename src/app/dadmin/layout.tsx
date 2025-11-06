
import AdminShell from "./_components/AdminShell";

export default function DadminLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 font-sans">
        <AdminShell>
            {children}
        </AdminShell>
      </body>
    </html>
  );
}
