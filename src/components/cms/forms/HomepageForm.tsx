

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HomepageSchema, HeroSlideSchema } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import type { HomePage } from "@/lib/types";
import { GripVertical, Plus, Trash } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { defaultHeroSlide } from "@/lib/defaults/siteDefaults";


function SortableSlideItem({ id, index, control, remove }: { id: string; index: number; control: any, remove: (index: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("flex gap-2 items-start p-3 rounded-lg border", isDragging ? 'bg-slate-50 shadow-lg' : 'bg-white')}>
      <div className="flex items-center h-10 pt-6">
        <button type="button" {...attributes} {...listeners} className="p-2 text-slate-500 cursor-grab focus:cursor-grabbing focus:bg-slate-100 rounded">
            <GripVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.${index}.image.src`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Image URL</FormLabel><FormControl><Input {...field} placeholder="/hero.jpg" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`hero.slides.${index}.image.alt`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Image Alt Text</FormLabel><FormControl><Input {...field} placeholder="Description of image" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.${index}.heading`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Heading</FormLabel><FormControl><Input {...field} placeholder="Slide-specific title" /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={control} name={`hero.slides.${index}.subheading`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Subheading</FormLabel><FormControl><Input {...field} placeholder="Brief text for the slide" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="md:col-span-2 space-y-2">
             <FormField control={control} name={`hero.slides.${index}.body`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Body</FormLabel><FormControl><Textarea {...field} placeholder="Optional longer text." rows={2} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.${index}.cta.label`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">CTA Label</FormLabel><FormControl><Input {...field} placeholder="e.g. Learn More" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`hero.slides.${index}.cta.href`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">CTA Link</FormLabel><FormControl><Input {...field} placeholder="/services" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <div className="md:col-span-2">
            <FormField
              control={control}
              name={`hero.slides.${index}.visible`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-2 pt-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm !mt-0">Visible</FormLabel>
                </FormItem>
              )}
            />
        </div>
      </div>
      <div className="flex items-center h-10 pt-6">
        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-10 w-10">
            <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


export function HomepageForm({ data, onSave }: { data: HomePage, onSave: (data: HomePage) => Promise<boolean> }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof HomepageSchema>>({
    resolver: zodResolver(HomepageSchema),
    defaultValues: data,
  });
  
  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "hero.slides",
  });

  async function onSubmit(values: z.infer<typeof HomepageSchema>) {
    setIsSaving(true);
    const success = await onSave(values);
    if (success) {
      form.reset(values);
    }
    setIsSaving(false);
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
            <div className="space-y-2 pt-4">
                <FormLabel>Hero Slides</FormLabel>
                <CardDescription>Add up to 6 slides. Drag to reorder.</CardDescription>
                <div className="p-4 border rounded-lg bg-slate-50/50">
                    {fields.length > 0 ? (
                        <DndContext sensors={[]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <SortableSlideItem key={field.id} id={field.id} index={index} control={form.control} remove={remove} />
                                ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <p className="mt-2 text-sm">No slides. The hero will be empty.</p>
                        </div>
                    )}
                </div>
                 {fields.length < 6 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => append(defaultHeroSlide)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Slide
                    </Button>
                )}
            </div>

            <div className="space-y-2 pt-4">
                <FormLabel>Rotation Settings</FormLabel>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                     <FormField
                        control={form.control}
                        name="hero.rotationDelaySec"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
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
