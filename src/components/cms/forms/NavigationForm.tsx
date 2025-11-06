"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationSchema, NavItemSchema } from "@/lib/schemas";
import { updateNavigation } from "@/lib/cms";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash } from "lucide-react";

function NavItems({ control, name }: { control: any, name: "primary" | "footer" }) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end">
          <FormField
            control={control}
            name={`${name}.${index}.label`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className={cn(index !== 0 && "sr-only")}>Label</FormLabel>
                <FormControl><Input {...field} placeholder="Link Label" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${name}.${index}.href`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className={cn(index !== 0 && "sr-only")}>URL</FormLabel>
                <FormControl><Input {...field} placeholder="/path-or-url" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ label: "", href: "" })}
      >
        Add Link
      </Button>
    </div>
  );
}


export function NavigationForm({ data }: { data: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof NavigationSchema>>({
    resolver: zodResolver(NavigationSchema),
    defaultValues: data || {},
  });

  async function onSubmit(values: z.infer<typeof NavigationSchema>) {
    setIsSaving(true);
    try {
      await updateNavigation(values);
      toast({ title: "Success", description: "Navigation saved." });
    } catch (e) {
      toast({ title: "Error", description: "Could not save navigation.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="primary">
            <TabsList>
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
            </TabsList>
            <TabsContent value="primary">
                <Card className="mt-4">
                  <CardHeader><CardTitle>Primary Navigation</CardTitle></CardHeader>
                  <CardContent>
                    <NavItems control={form.control} name="primary" />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="footer">
                <Card className="mt-4">
                  <CardHeader><CardTitle>Footer Navigation</CardTitle></CardHeader>
                  <CardContent>
                    <NavItems control={form.control} name="footer" />
                  </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 bg-slate-50/90 py-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Navigation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Minimal stub for cn
const cn = (...args: any[]) => args.filter(Boolean).join(' ');
