
"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HomepageSchema } from "@/lib/schemas";
import type { HomePage, HeroSlide } from "@/lib/types";
import { GripVertical, Plus, Trash } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { defaultHeroSlide } from "@/lib/defaults/siteDefaults";
import { toast } from "@/hooks/use-toast";
import { LinkPicker } from "../inputs/LinkPicker";


function WhatWeDoFields() {
  const { control } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>What We Do Section</CardTitle>
        <CardDescription>Configure the introductory section below the hero.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
            control={control}
            name="whatWeDo.enabled"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>Show this section on the homepage.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
            )}
        />
        <FormField
            name="whatWeDo.eyebrow"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Eyebrow Text</FormLabel><FormControl><Input placeholder="WHY, HOW, WHAT" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
        <FormField
            name="whatWeDo.title"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="What We Do" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
        <FormField
            name="whatWeDo.subtitle"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input placeholder="Section subtitle" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
        <FormField
            name="whatWeDo.body"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Body Text</FormLabel><FormControl><Textarea placeholder="Section body text" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
      </CardContent>
    </Card>
  );
}

function ServiceItemFields({ control, index, remove }: { control: any, index: number, remove: (index: number) => void }) {
    return (
        <div className="rounded-lg border p-4 space-y-4 relative bg-slate-50/50">
            <div className="space-y-2">
                <FormField
                    name={`services.items.${index}.icon`}
                    control={control}
                    render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Icon (optional)</FormLabel><FormControl><Input placeholder="e.g. BrainCircuit" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                    )}
                />
                <FormField
                    name={`services.items.${index}.title`}
                    control={control}
                    render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Title</FormLabel><FormControl><Input placeholder="Service Title" {...field} value={field.value ?? ""} /></FormControl></FormItem>
                    )}
                />
                <FormField
                    name={`services.items.${index}.description`}
                    control={control}
                    render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Description</FormLabel><FormControl><Textarea placeholder="Service description" {...field} rows={2} value={field.value ?? ""} /></FormControl></FormItem>
                    )}
                />
            </div>
            <div>
              <FormLabel className="text-xs">Link (optional)</FormLabel>
              <LinkPicker namePrefix={`services.items.${index}.link`} />
            </div>
            <div className="text-right">
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          </div>
    )
}

function ServicesFields() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services.items",
    keyName: "fieldId",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Section</CardTitle>
        <CardDescription>Manage the list of services displayed on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
            control={control}
            name="services.enabled"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>Show this section on the homepage.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
            )}
        />
        <FormField
            name="services.title"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input placeholder="Our Services" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
        <FormField
            name="services.subtitle"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Section Subtitle</FormLabel><FormControl><Input placeholder="Section subtitle" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />

        <div className="space-y-4 pt-4">
          <FormLabel>Service Items</FormLabel>
            {fields.map((field, i) => (
                <ServiceItemFields key={field.fieldId} control={control} index={i} remove={remove} />
            ))}
            <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ icon: "", title: "", description: "", link: { type: 'internal', label: '', internalRef: null, externalUrl: '', newTab: false } })}
            >
            <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}


function SortableSlideItem({ id, index, control, remove }: { id: string; index: number; control: any, remove: (index: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("flex gap-2 items-start p-3 rounded-lg border", isDragging ? 'bg-slate-50 shadow-lg' : 'bg-white')}>
      <div className="flex items-center h-10 pt-8">
        <button type="button" {...attributes} {...listeners} className="p-2 text-slate-500 cursor-grab focus:cursor-grabbing focus:bg-slate-100 rounded">
            <GripVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.${index}.image.src`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="/media/hero.jpg" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`hero.slides.${index}.image.alt`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Image Alt Text</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Description of image" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.${index}.heading`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Heading</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Slide-specific title" /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={control} name={`hero.slides.${index}.subheading`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Subheading</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Brief text for the slide" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="md:col-span-2 space-y-2">
             <FormField control={control} name={`hero.slides.${index}.body`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Body (optional)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} placeholder="Optional longer text." rows={2} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="md:col-span-2">
            <FormLabel className="text-xs">Call to Action (CTA)</FormLabel>
            <LinkPicker namePrefix={`hero.slides.${index}.cta`} />
        </div>

        <div className="md:col-span-2 flex items-center justify-between">
            <FormField
              control={control}
              name={`hero.slides.${index}.visible`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-start gap-2 pt-2">
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm !mt-0">Visible</FormLabel>
                </FormItem>
              )}
            />
             <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                <Trash className="h-4 w-4 mr-2" /> Remove Slide
            </Button>
        </div>
      </div>
    </div>
  );
}


export function HomepageForm({ data, onSave }: { data: HomePage, onSave: (data: HomePage) => Promise<any> }) {
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
    keyName: "fieldId"
  });

  async function onSubmit(values: z.infer<typeof HomepageSchema>) {
    setIsSaving(true);
    const result = await onSave(values);
    if (result.ok) {
      toast({ title: 'Success', description: 'Homepage saved successfully.' });
      form.reset(values);
    } else {
       toast({ title: 'Error', description: result.error || "Failed to save homepage.", variant: 'destructive' });
    }
    setIsSaving(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(item => item.fieldId === active.id);
      const newIndex = fields.findIndex(item => item.fieldId === over.id);
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
                            <SortableContext items={fields.map(f => f.fieldId)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <SortableSlideItem key={field.fieldId} id={field.fieldId} index={index} control={form.control} remove={remove} />
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
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value ?? 5)}>
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

        <WhatWeDoFields />
        <ServicesFields />
        
        <div className="sticky bottom-0 bg-slate-50/90 py-4">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? "Saving..." : "Save Homepage"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
