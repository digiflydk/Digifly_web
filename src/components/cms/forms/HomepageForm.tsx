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
import type { HomePage } from "@/lib/types";

export function HomepageForm({ data }: { data: HomePage }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof HomepageSchema>>({
    resolver: zodResolver(HomepageSchema),
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "servicesPreview",
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
            <FormField control={form.control} name="hero.image.src" render={({ field }) => (
              <FormItem><FormLabel>Hero Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g., /hero.jpg or https://..." /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="hero.image.alt" render={({ field }) => (
                <FormItem><FormLabel>Hero Image Alt Text</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="A descriptive caption for the image" /></FormControl><FormMessage /></FormItem>
            )} />
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
