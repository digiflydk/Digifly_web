
"use client";
import { useState } from "react";
import { deleteCase } from "@/lib/cms-api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import type { CaseDoc } from "@/lib/types";

export default function CasesTable({ initialRows }: { initialRows: Partial<CaseDoc>[] }) {
  const [rows, setRows] = useState(initialRows);
  const [deleteCandidate, setDeleteCandidate] = useState<Partial<CaseDoc> | null>(null);

  const handleDelete = async () => {
    if (!deleteCandidate?.id) return;
    const originalCases = rows;
    
    // Optimistic update
    setRows(currentCases => currentCases.filter(c => c.id !== deleteCandidate.id));
    
    try {
      await deleteCase(deleteCandidate.id);
      toast({ title: "Success", description: "Case study deleted." });
    } catch (e: any) {
      // Rollback on error
      setRows(originalCases);
      toast({ title: "Error", description: e.message || "Could not delete case study.", variant: "destructive" });
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/dadmin/cases/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Case Study
          </Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.title}</TableCell>
                <TableCell className="font-mono text-xs">{caseItem.slug}</TableCell>
                <TableCell>
                  <Badge variant={caseItem.published ? "default" : "secondary"}>
                    {caseItem.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dadmin/cases/${caseItem.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteCandidate(caseItem)} className="text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the case study &quot;{deleteCandidate?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
