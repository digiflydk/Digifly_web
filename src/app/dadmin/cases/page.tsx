
"use client";
import { useEffect, useState } from "react";
import { getCases, deleteCase } from "@/lib/cms";
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

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseDoc[]>([]);
  const [deleteCandidate, setDeleteCandidate] = useState<CaseDoc | null>(null);

  useEffect(() => {
    getCases({ limit: 100 }).then(setCases);
  }, []);

  const handleDelete = async () => {
    if (!deleteCandidate?.id) return;
    try {
      await deleteCase(deleteCandidate.id);
      setCases(cases.filter(c => c.id !== deleteCandidate.id));
      toast({ title: "Success", description: "Case study deleted." });
    } catch (e) {
      toast({ title: "Error", description: "Could not delete case study.", variant: "destructive" });
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
            {cases.map((caseItem) => (
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
