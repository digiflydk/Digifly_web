
"use client";
import { useFormContext, useWatch } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LinkPicker } from "../../inputs/LinkPicker";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// DGF-362: This component now only edits the FIRST slide in the array.
function HeroSlideForm() {
  const { control } = useFormContext<HomePage>();
  
  // Watch the label to conditionally render the link picker
  const hasCtaLabel = useWatch({ control, name: `hero.slides.0.cta.label` });

  return (
    <div className="flex gap-2 items-start p-3 rounded-lg border bg-white">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.0.image.src`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="/media/hero.jpg" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`hero.slides.0.image.alt`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Image Alt Text</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Description of image" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <div className="space-y-2">
            <FormField control={control} name={`hero.slides.0.eyebrow`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Eyebrow</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Optional eyebrow text" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`hero.slides.0.heading`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Heading</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Slide-specific title" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="md:col-span-2 space-y-2">
             <FormField control={control} name={`hero.slides.0.body`} render={({ field }) => (
                <FormItem><FormLabel className="text-xs">Body (optional)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} placeholder="Optional longer text." rows={2} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="md:col-span-2">
            <FormLabel className="text-xs">Call to Action (CTA)</FormLabel>
            {/* DGF-362: Use the LinkPicker for the first slide's CTA */}
            <LinkPicker namePrefix={`hero.slides.0.cta`} />
        </div>
      </div>
    </div>
  );
}

export default function HeroForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-4">
          <FormLabel>Hero Slide</FormLabel>
          <CardDescription>Edit the content of the single hero slide.</CardDescription>
          <div className="p-4 border rounded-lg bg-slate-50/50">
            <HeroSlideForm />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
