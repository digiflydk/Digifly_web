"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, PlusCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CaseDoc } from "@/lib/schemas.case";

export default function CasesTable() {
  const [rows, setRows] = React.useState<CaseDoc[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/cases", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setRows(json.data);
      else console.error("Load cases failed:", json.error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function removeRow(id?: string) {
    if (!id) return;
    const res = await fetch(`/api/cms/cases/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) setRows((prev) => prev.filter((r) => r.id !== id));
    else alert(json.error || "Failed to delete");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Cases</h2>
        <Link href="/dadmin/cases/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Client</th>
              <th className="p-3">Published</th>
              <th className="p-3 w-12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No cases yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3">{row.title}</td>
                  <td className="p-3">{row.slug}</td>
                  <td className="p-3">{row.client || "-"}</td>
                  <td className="p-3">{row.published ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="bg-popover text-popover-foreground border shadow-md z-50"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dadmin/cases/${row.id}/edit`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <ConfirmDialog
                          title="Delete case?"
                          description="This action cannot be undone."
                          confirmText="Delete"
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          }
                          onConfirm={() => removeRow(row.id)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
