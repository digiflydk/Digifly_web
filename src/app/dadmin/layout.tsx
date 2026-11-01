import AdminShell from "./_components/AdminShell";
// Retained legacy UI is blocked by middleware pending a separate authenticated CMS release.
export const dynamic = "force-dynamic";
export default function DadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
