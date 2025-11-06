"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomepageSchema } from "@/lib/schemas";
import { updateHomepage } from "@/lib/cms";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function HomepageForm({ data }: { data: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof HomepageSchema>>({
    resolver: zodResolver(HomepageSchema),
    defaultValues: data || {},
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  async function onSubmit(values: z.infer<typeof HomepageSchema>) {
    setIsSaving(true);
    try {
      await updateHomepage(values);
      toast({ title: "Success", description: "Homepage saved." });
    } catch (e) {
      toast({ title: "Error", description: "Could not save homepage.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="hero.headline" render={({ field }) => (
              <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="hero.subcopy" render={({ field }) => (
              <FormItem><FormLabel>Subcopy</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Features Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                        <FormField control={form.control} name={`features.${index}.title`} render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel className={index !== 0 ? 'sr-only' : ''}>Title</FormLabel><FormControl><Input {...field} placeholder="Feature Title" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`features.${index}.text`} render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel className={index !== 0 ? 'sr-only' : ''}>Description</FormLabel><FormControl><Input {...field} placeholder="Feature description" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="outline" onClick={() => remove(index)} className="mt-8">Remove</Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({title: '', text: ''})}>Add Feature</Button>
            </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-slate-50/90 py-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Homepage"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
