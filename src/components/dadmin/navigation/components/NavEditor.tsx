
"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLinkSchema } from "@/data/schemas";
import { useState, useTransition } from "react";
import { GripVertical, Plus, Trash } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LinkPicker } from "@/components/cms/inputs/LinkPicker";
import { useFieldArray } from "react-hook-form";
import type { Navigation, NavLink } from "@/lib/types";

const FormSchema = z.object({
  items: z.array(NavLinkSchema),
});

function SortableItem({ id, index, control, remove, namePrefix }: { id: string; index: number; control: any, remove: (index: number) => void, namePrefix: string }) {
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
        <LinkPicker namePrefix={`${namePrefix}.${index}.link`} />
      </div>
      <div className="flex items-center h-10 pt-8">
        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-10 w-10">
            <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function NavEditor({ title, description, onSaveKey }: { title: string; description?: string; items: NavLink[]; onSaveKey: 'header' | 'footer'; initialData: Navigation }) {
  const { control } = useFormContext<Navigation>();
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const namePrefix = onSaveKey === 'header' ? 'header' : 'footer.columns.0.links';
  
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: namePrefix as any, // RHF typing is tricky with nested paths
    keyName: "fieldId",
  });

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
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <DndContext sensors={[]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext items={fields.map(f => f.fieldId)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <SortableItem key={field.fieldId} id={field.fieldId} index={index} control={control} remove={() => setDeleteIndex(index)} namePrefix={namePrefix} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => append({ id: crypto.randomUUID(), link: { label: "", type: 'internal', internalRef: null, externalUrl: '', newTab: false } })}>
            <Plus className="mr-2 h-4 w-4" /> Add Link
          </Button>
        </div>
      </CardContent>

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
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
