
"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ZodError } from "zod";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms-client";
import { SITE_DEFAULTS } from "@/lib/defaults/siteDefaults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GeneralTab from "./GeneralTab";
import ContactTab from "./ContactTab";
import OpeningHoursTab from "./OpeningHoursTab";
import SeoTab from "./SeoTab";
import { LiveSeoPreview } from "@/components/cms/forms/SeoPreviewCard";
import { withSeoDefaults } from "@/lib/seo-defaults";

async function loadSettings(): Promise<SiteSettings> {
    try {
        const data = await getSiteSettings();
        const parsed = SiteSettingsSchema.safeParse(data || {});
        if (!parsed.success) {
            console.warn("loadSettings: API data failed validation, falling back to defaults.", parsed.error.format());
            return SiteSettingsSchema.parse({});
        }
        return parsed.data;
    } catch (e: any) {
        console.error(`loadSettings: API call failed or data is critically malformed. Error: ${e.message}`);
        return SiteSettingsSchema.parse({});
    }
}

function WatchedSeoPreview({ control, siteUrl, initialDescription }: { control: any, siteUrl: string, initialDescription?: string | null }) {
    const seoWatch = useWatch({ control, name: "seo" });
    const siteTitleWatch = useWatch({ control, name: "general.title" });

    const seoForPreview = withSeoDefaults(seoWatch);

    return (
        <LiveSeoPreview
            seo={seoForPreview}
            fallbackTitle={siteTitleWatch || "Site"}
            fallbackDescription={initialDescription || ""}
            siteUrl={siteUrl}
        />
    );
}

export default function SiteSeoForm() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings()
      .then(data => setInitialData(data))
      .catch(err => {
        setError(err.message);
        setInitialData(SiteSettingsSchema.parse({})); 
      })
  }, []);

  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: SITE_DEFAULTS,
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
        const safeData = {
            ...initialData,
            seo: withSeoDefaults(initialData.seo)
        }
        form.reset(safeData);
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
  
  if (error && !initialData) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Failed to Load Settings</AlertTitle>
        <AlertDescription className="break-all">{error}</AlertDescription>
      </Alert>
    )
  }

  if (!initialData) {
     return (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
                <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="hours">Hours</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general"><GeneralTab control={form.control} /></TabsContent>
                    <TabsContent value="contact"><ContactTab control={form.control} /></TabsContent>
                    <TabsContent value="hours"><OpeningHoursTab control={form.control} /></TabsContent>
                    <TabsContent value="seo"><SeoTab control={form.control} /></TabsContent>
                </Tabs>
            </div>
             <div className="md:col-span-1 md:sticky top-24">
                <h3 className="text-lg font-semibold mb-2">Live SEO Preview</h3>
                <p className="text-sm text-slate-500 mb-4">This is how your site will generally appear on Google and social media.</p>
                <WatchedSeoPreview 
                    control={form.control} 
                    siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "digifly.app"}
                    initialDescription={initialData.seo?.defaultDescription}
                />
            </div>
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
