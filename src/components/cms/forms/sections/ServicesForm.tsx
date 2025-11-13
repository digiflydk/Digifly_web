
"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LinkPicker } from "../../inputs/LinkPicker";

function ServiceItemFields({ index }: { index: number }) {
    const { control } = useFormContext<HomePage>();
    return (
        <div className="rounded-lg border p-4 space-y-4 relative bg-slate-50/50">
            <h3 className="font-semibold text-sm">Service Item #{index + 1}</h3>
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
                    name={`services.items.${index}.body`}
                    control={control}
                    render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Body Text</FormLabel><FormControl><Textarea placeholder="Service description" {...field} rows={2} value={field.value ?? ""} /></FormControl></FormItem>
                    )}
                />
            </div>
            <div>
              <FormLabel className="text-xs">Link (optional)</FormLabel>
              <LinkPicker namePrefix={`services.items.${index}.link`} />
            </div>
          </div>
    )
}

export default function ServicesForm() {
  const { control } = useFormContext<HomePage>();
  const { fields } = useFieldArray({
    control,
    name: "services.items",
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
            {/* DGF-362: Statically render 3 items, not a dynamic array */}
            <div className="grid gap-4">
              <ServiceItemFields index={0} />
              <ServiceItemFields index={1} />
              <ServiceItemFields index={2} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
