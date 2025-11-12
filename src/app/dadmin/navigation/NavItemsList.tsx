
"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import LinkPicker from "./components/LinkPicker";
import type { Navigation } from "@/lib/schemas";

type PageInfo = { id: string; title: string; path: string };

function SortableItem({
  id,
  index,
  remove,
  namePrefix,
  pages,
}: {
  id: string;
  index: number;
  remove: (index: number) => void;
  namePrefix: string;
  pages: PageInfo[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex gap-2 items-start p-2 rounded-md ${isDragging ? 'bg-slate-50 shadow-lg' : ''}`}>
      <div className="flex items-center h-10 pt-8">
        <button type="button" {...attributes} {...listeners} className="p-2 text-slate-500 cursor-grab focus:cursor-grabbing focus:bg-slate-100 rounded">
          <GripVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1">
        <LinkPicker namePrefix={`${namePrefix}.${index}.link`} pages={pages} />
      </div>
      <div className="flex items-center h-10 pt-8">
        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-10 w-10">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function NavItemsList({ title, namePrefix, pages }: {
  title: string;
  namePrefix: 'header' | 'footer.columns.0.links';
  pages: PageInfo[];
}) {
  const { control } = useFormContext<Navigation>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: namePrefix,
    keyName: "fieldId",
  });
  
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(item => item.fieldId === active.id);
      const newIndex = fields.findIndex(item => item.fieldId === over.id);
      move(oldIndex, newIndex);
    }
  }

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
      setDeleteIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext sensors={[]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext items={fields.map(f => f.fieldId)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <SortableItem key={field.fieldId} id={field.fieldId} index={index} remove={() => setDeleteIndex(index)} namePrefix={namePrefix} pages={pages} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => append({ id: crypto.randomUUID(), link: { type: 'internal', internalRef: '', label: '', newTab: false } })}>
            <Plus className="mr-2 h-4 w-4" /> Add Link
          </Button>
        </div>

        <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this navigation link. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
