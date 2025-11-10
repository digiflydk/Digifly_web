
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ZodError } from "zod";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GeneralTab from "./GeneralTab";
import ContactTab from "./ContactTab";
import OpeningHoursTab from "./OpeningHoursTab";
import SeoTab from "./SeoTab";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiteSeoForm() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);

  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: initialData || undefined,
    mode: 'onChange',
  });

  useEffect(() => {
    getSiteSettings().then(setInitialData).catch(() => {
        // On failure, parse an empty object to get defaults
        const defaults = SiteSettingsSchema.parse({});
        setInitialData(defaults);
    });
  }, []);

  useEffect(() => {
    if (initialData) {
        form.reset(initialData);
    }
  }, [initialData, form]);

  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(values: SiteSettings) {
    setIsSaving(true);
    try {
        const result = await saveSiteSettings(values);
        if (!result) { 
            throw new Error("An unknown error occurred during save.");
        }
        toast({ title: "✅ Success", description: "Site settings saved." });
        form.reset(values); 
    } catch (e: any) {
        if (e instanceof ZodError) {
             toast({ title: "Validation Error", description: "Please check the form for errors.", variant: "destructive" });
        } else {
            toast({ title: "Error", description: e.message || "Could not save settings.", variant: "destructive" });
        }
    } finally {
      setIsSaving(false);
    }
  }

  if (!initialData) {
    return <div className="space-y-4"><Skeleton className="h-10 w-1/4" /><Skeleton className="h-64 w-full" /></div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="hours">Hours</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>
                <TabsContent value="general"><GeneralTab /></TabsContent>
                <TabsContent value="contact"><ContactTab /></TabsContent>
                <TabsContent value="hours"><OpeningHoursTab /></TabsContent>
                <TabsContent value="seo"><SeoTab /></TabsContent>
            </Tabs>
        </div>

        <div className="sticky bottom-0 bg-slate-50/90 py-4 dark:bg-slate-900/90 border-t -mx-6 px-6">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
