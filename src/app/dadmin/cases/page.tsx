
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listCases, createCaseDraft, deleteCaseById } from "@/lib/cms-api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Trash2, Pencil } from "lucide-react";

type Row = { id: string; title: string; slug: string; status: string };

export default function CasesAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const refresh = async () => {
    const res = await listCases();
    setRows(res.data as any);
  };
  useEffect(() => { void refresh(); }, []);

  const onCreate = async () => {
    const { id } = await createCaseDraft();
    window.location.href = `/dadmin/cases/${id}`;
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this case?")) return;
    await deleteCaseById(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Case Studies</h1>
        <Button onClick={onCreate}><Plus className="mr-2 h-4 w-4" /> New Case Study</Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2">{r.slug}</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="z-50 bg-popover text-popover-foreground border shadow-md rounded-md"
                    >
                      <DropdownMenuItem asChild>
                        <Link href={`/dadmin/cases/${r.id}`} className="flex items-center">
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(r.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>No cases yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
