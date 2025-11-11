
"use client";
import { useFormContext } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LinkPicker } from "../../inputs/LinkPicker";

export default function WhatWeDoForm() {
  const { control } = useFormContext<HomePage>();

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
            name="whatWeDo.subtitle"
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
            name="whatWeDo.body"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Body Text</FormLabel><FormControl><Textarea placeholder="Section body text" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
         <FormField
            name="whatWeDo.image.src"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="/media/image.jpg" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
        <FormField
            name="whatWeDo.image.alt"
            control={control}
            render={({ field }) => (
                <FormItem><FormLabel>Image Alt Text</FormLabel><FormControl><Input placeholder="Description of image" {...field} value={field.value ?? ""} /></FormControl></FormItem>
            )}
        />
        <div className="pt-2">
            <FormLabel>Call to Action Button</FormLabel>
            <LinkPicker namePrefix="whatWeDo.cta" />
        </div>
      </CardContent>
    </Card>
  );
}
