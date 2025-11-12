
"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LinkPicker } from "../../inputs/LinkPicker";
import { defaultServiceItem } from "@/lib/defaults/siteDefaults";

function ServiceItemFields({ index, remove }: { index: number, remove: (index: number) => void }) {
    const { control } = useFormContext<HomePage>();
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
            <div className="text-right">
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          </div>
    )
}

export default function ServicesForm() {
  const { control } = useFormContext<HomePage>();
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
                <ServiceItemFields key={field.fieldId} index={i} remove={remove} />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(defaultServiceItem)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
