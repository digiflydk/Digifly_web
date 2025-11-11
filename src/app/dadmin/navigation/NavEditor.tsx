
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLinkSchema, NavigationSchema } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { GripVertical, Plus, Trash } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LinkPicker } from "@/components/cms/inputs/LinkPicker";
import { useFieldArray } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { saveNavigationAction } from "./actions";
import type { Navigation, NavLink } from "@/lib/types";

const FormSchema = z.object({
  items: z.array(NavLinkSchema),
});

type NavEditorProps = {
  title: string;
  description?: string;
  items: NavLink[];
  onSaveKey: 'header' | 'footer';
  initialData: Navigation;
};

function SortableItem({ id, index, control, remove }: { id: string; index: number; control: any, remove: (index: number) => void }) {
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
        <LinkPicker namePrefix={`items.${index}.link`} />
      </div>
      <div className="flex items-center h-10 pt-8">
        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-10 w-10">
            <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function NavEditor({ title, description, items, onSaveKey, initialData }: NavEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items },
  });

  useEffect(() => {
    form.reset({ items });
  }, [items, form]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "fieldId",
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsSaving(true);
    try {
      let fullNavPayload: Navigation;
      if (onSaveKey === 'header') {
        fullNavPayload = { ...initialData, header: values.items };
      } else {
        fullNavPayload = { 
            ...initialData, 
            footer: { 
                ...initialData.footer, 
                columns: [{ title: initialData.footer.columns[0]?.title || "Links", links: values.items }] 
            }
        };
      }
      const result = await saveNavigationAction(fullNavPayload);
      if (result.ok) {
        toast({ title: "Success", description: "Navigation saved." });
        form.reset(values);
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DndContext sensors={[]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <SortableContext items={fields.map(f => f.fieldId)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <SortableItem key={field.fieldId} id={field.fieldId} index={index} control={form.control} remove={() => setDeleteIndex(index)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex justify-between items-center pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => append({ link: { label: "", type: 'internal', internalRef: 'home', externalUrl: '', newTab: false } })}>
                <Plus className="mr-2 h-4 w-4" /> Add Link
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" disabled={!form.formState.isDirty} onClick={() => form.reset({ items })}>Reset</Button>
                <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
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
