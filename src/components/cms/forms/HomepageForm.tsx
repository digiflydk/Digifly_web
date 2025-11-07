"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HomepageSchema } from "@/lib/schemas";
import { updateHomepage } from "@/lib/cms";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import type { HomePage } from "@/lib/types";
import { GripVertical, Plus, Trash, Image as ImageIcon } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";


function SortableImageItem({ id, index, control, remove }: { id: string; index: number; control: any, remove: (index: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("flex gap-2 items-start p-3 rounded-lg border", isDragging ? 'bg-slate-50 shadow-lg' : 'bg-white')}>
      <div className="flex items-center h-10">
        <button type="button" {...attributes} {...listeners} className="p-2 text-slate-500 cursor-grab focus:cursor-grabbing focus:bg-slate-100 rounded">
            <GripVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 space-y-2">
        <FormField control={control} name={`hero.images.${index}.src`} render={({ field }) => (
            <FormItem><FormControl><Input {...field} placeholder="Image URL (e.g., /hero.jpg)" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name={`hero.images.${index}.alt`} render={({ field }) => (
            <FormItem><FormControl><Input {...field} placeholder="Alt Text" /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-10 w-10">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}


export function HomepageForm({ data }: { data: HomePage }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof HomepageSchema>>({
    resolver: zodResolver(HomepageSchema),
    defaultValues: data,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "hero.images",
  });

  async function onSubmit(values: z.infer<typeof HomepageSchema>) {
    setIsSaving(true);
    try {
      await updateHomepage(values);
      toast({ title: "Success", description: "Homepage saved." });
      form.reset(values);
    } catch (e) {
      toast({ title: "Error", description: "Could not save homepage.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(item => item.id === active.id);
      const newIndex = fields.findIndex(item => item.id === over.id);
      move(oldIndex, newIndex);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="hero.title" render={({ field }) => (
              <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="hero.subtitle" render={({ field }) => (
              <FormItem><FormLabel>Subcopy</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="hero.primaryCta.label" render={({ field }) => (
              <FormItem><FormLabel>CTA Label</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="hero.primaryCta.href" render={({ field }) => (
              <FormItem><FormLabel>CTA URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="space-y-2 pt-4">
                <FormLabel>Hero Images</FormLabel>
                <CardDescription>Add up to 6 images. Drag to reorder.</CardDescription>
                <div className="p-4 border rounded-lg bg-slate-50/50">
                    {fields.length > 0 ? (
                        <DndContext sensors={[]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <SortableImageItem key={field.id} id={field.id} index={index} control={form.control} remove={remove} />
                                ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <ImageIcon className="mx-auto h-8 w-8" />
                            <p className="mt-2 text-sm">No images. The hero will show a default placeholder.</p>
                        </div>
                    )}
                </div>
                 {fields.length < 6 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ src: "", alt: "" })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                )}
            </div>

            <div className="space-y-2 pt-4">
                <FormLabel>Rotation Settings</FormLabel>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <FormField
                        control={form.control}
                        name="hero.rotate"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between flex-1">
                            <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto-rotate Images</FormLabel>
                            <FormDescription>
                                Automatically cycle through images if more than one is present.
                            </FormDescription>
                            </div>
                            <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hero.delaySec"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)} disabled={!form.watch('hero.rotate')}>
                                    <FormControl>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Delay" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {[3, 5, 8, 10, 15].map(sec => <SelectItem key={sec} value={String(sec)}>{sec} seconds</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

          </CardContent>
        </Card>
        
        <div className="sticky bottom-0 bg-slate-50/90 py-4">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? "Saving..." : "Save Homepage"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
