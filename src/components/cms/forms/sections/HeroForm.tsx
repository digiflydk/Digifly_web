

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
import { hexToRgb, cmykToRgba, rgbToCmyk } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";

const PRESETS = [
    { id: 'dark-80', label: 'Dark (80%)', cmyk: { c: 0, m: 0, y: 0, k: 80 }, opacityPercent: 60 },
    { id: 'brand-purple', label: 'Brand Purple', cmyk: { c: 70, m: 80, y: 0, k: 0 }, opacityPercent: 75 },
    { id: 'soft-grey', label: 'Soft Grey', cmyk: { c: 10, m: 5, y: 5, k: 20 }, opacityPercent: 85 },
    { id: 'warm-black', label: 'Warm Black', cmyk: { c: 0, m: 20, y: 30, k: 95 }, opacityPercent: 70 },
]

function HeroSlideForm() {
  const { control, setValue } = useFormContext<HomePage>();
  
  const overlayEnabled = useWatch({ control, name: `hero.slides.0.overlay.enabled`});
  const cmyk = useWatch({ control, name: `hero.slides.0.overlay.cmyk` });
  const opacity = useWatch({ control, name: `hero.slides.0.overlay.opacityPercent` });

  const previewColor = cmykToRgba(cmyk?.c ?? 0, cmyk?.m ?? 0, cmyk?.y ?? 0, cmyk?.k ?? 0, (opacity ?? 60) / 100);

  const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const hex = event.target.value;
      const rgb = hexToRgb(hex);
      if (rgb) {
          const newCmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
          setValue('hero.slides.0.overlay.cmyk', newCmyk, { shouldDirty: true });
      }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
      setValue('hero.slides.0.overlay.cmyk', preset.cmyk, { shouldDirty: true });
      setValue('hero.slides.0.overlay.opacityPercent', preset.opacityPercent, { shouldDirty: true });
  }

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
                name={`hero.slides.0.textColor`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Text Color</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="#FFFFFF" value={field.value ?? ""} />
                        </FormControl>
                    </FormItem>
                )}
            />
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
            {overlayEnabled !== false && (
                <div className="mt-4 p-4 border rounded-lg space-y-4">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Color Picker</Label>
                            <Input type="color" onChange={handleColorPickerChange} className="h-10 p-1" />
                        </div>
                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="h-10 w-full rounded-md border" style={{ backgroundColor: previewColor }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <FormField control={control} name={`hero.slides.0.overlay.cmyk.c`} render={({ field }) => (
                            <FormItem><FormLabel>Cyan %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl></FormItem>
                        )} />
                        <FormField control={control} name={`hero.slides.0.overlay.cmyk.m`} render={({ field }) => (
                            <FormItem><FormLabel>Magenta %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl></FormItem>
                        )} />
                        <FormField control={control} name={`hero.slides.0.overlay.cmyk.y`} render={({ field }) => (
                            <FormItem><FormLabel>Yellow %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 0} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl></FormItem>
                        )} />
                        <FormField control={control} name={`hero.slides.0.overlay.cmyk.k`} render={({ field }) => (
                            <FormItem><FormLabel>Black %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 80} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl></FormItem>
                        )} />
                        <FormField control={control} name={`hero.slides.0.overlay.opacityPercent`} render={({ field }) => (
                            <FormItem><FormLabel>Opacity %</FormLabel><FormControl><Input type="number" min="0" max="100" {...field} value={field.value ?? 60} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl></FormItem>
                        )} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Presets</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map(p => (
                                <Button key={p.id} type="button" variant="outline" size="sm" onClick={() => applyPreset(p)}>
                                    {p.label}
                                </Button>
                            ))}
                        </div>
                    </div>
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
