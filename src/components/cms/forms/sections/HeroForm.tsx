
"use client";
import { useFormContext, useWatch } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LinkPicker } from "../../inputs/LinkPicker";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function HeroSlideForm() {
  const { control } = useFormContext<HomePage>();
  
  const hasCtaLabel = useWatch({ control, name: `hero.slides.0.cta.label` });
  const overlayEnabled = useWatch({ control, name: `hero.slides.0.overlay.enabled`});

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
            <LinkPicker namePrefix={`hero.slides.0.cta`} />
        </div>

        <div className="md:col-span-2 border-t pt-4">
            <FormField
                control={control}
                name={`hero.slides.0.overlay.enabled`}
                render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Overlay</FormLabel>
                        <FormDescription>Show a colored overlay on top of the hero image.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
                )}
            />
            {overlayEnabled && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 p-4 border rounded-lg">
                    <FormField control={control} name={`hero.slides.0.overlay.cmyk.c`} render={({ field }) => (
                        <FormItem><FormLabel>Cyan %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                    )} />
                    <FormField control={control} name={`hero.slides.0.overlay.cmyk.m`} render={({ field }) => (
                        <FormItem><FormLabel>Magenta %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                    )} />
                    <FormField control={control} name={`hero.slides.0.overlay.cmyk.y`} render={({ field }) => (
                        <FormItem><FormLabel>Yellow %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                    )} />
                    <FormField control={control} name={`hero.slides.0.overlay.cmyk.k`} render={({ field }) => (
                        <FormItem><FormLabel>Black %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 80} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                    )} />
                    <FormField control={control} name={`hero.slides.0.overlay.opacityPercent`} render={({ field }) => (
                        <FormItem><FormLabel>Opacity %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 60} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                    )} />
                </div>
            )}
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
