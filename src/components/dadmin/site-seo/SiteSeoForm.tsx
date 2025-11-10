
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import GeneralTab from "./tabs/GeneralTab";
import ContactTab from "./tabs/ContactTab";
import OpeningHoursTab from "./tabs/OpeningHoursTab";
import SeoTab from "./tabs/SeoTab";
import { emptySiteSeo, coerceToDefaults } from "./utils/formDefaults";

export default function SiteSeoForm() {
  const [dbData, setDbData] = useState<Partial<SiteSettings> | null>(null);
  const [dbDataLoaded, setDbDataLoaded] = useState(false);

  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: emptySiteSeo,
    mode: 'onChange',
  });

  useEffect(() => {
    fetch('/api/dadmin/site-seo')
      .then(res => res.json())
      .then(result => {
        if(result.ok) {
          setDbData(result.data)
        } else {
          throw new Error(result.error || "Failed to load data.");
        }
      })
      .catch((e) => {
        setDbData({});
        toast({ title: "Warning", description: `Could not load existing settings: ${e.message}`, variant: "destructive" });
      })
      .finally(() => setDbDataLoaded(true));
  }, []);

  useEffect(() => {
    if (dbDataLoaded && dbData) {
      form.reset(coerceToDefaults(dbData));
    }
  }, [dbDataLoaded, dbData, form]);

  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(values: SiteSettings) {
    setIsSaving(true);
    try {
        const res = await fetch('/api/dadmin/site-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const text = await res.text();
        let json: any;
        try { json = JSON.parse(text); } catch {
          throw new Error(`Unexpected response (${res.status}): ${text.slice(0,120)}`);
        }

        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || `Save failed (${res.status})`);
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

  if (!dbDataLoaded) {
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
