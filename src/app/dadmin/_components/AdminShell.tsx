import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export default function AdminShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="max-w-7xl mx-auto p-6">
            <header className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </header>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
