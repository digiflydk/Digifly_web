

"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { ZodError } from "zod";
import { saveSiteSettings } from "@/lib/cms";

async function loadSettings(): Promise<SiteSettings> {
    const res = await fetch("/api/cms/site", { cache: "no-store" });
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        if (!res.ok || !json?.ok) {
            throw new Error(json?.error?.message || `Request failed with status ${res.status}`);
        }
        const parsed = SiteSettingsSchema.safeParse(json.data || {});
        if (!parsed.success) {
            console.error("API data failed validation:", parsed.error);
            // Even if validation fails, return the default structure to avoid crashing the form
            return SiteSettingsSchema.parse({});
        }
        return parsed.data;
    } catch (e: any) {
        console.error(`API response was not valid or failed parsing (status ${res.status}). Error: ${e.message}`);
        // In case of any error, return a default object to prevent crashing the form.
        return SiteSettingsSchema.parse({});
    }
}

function ImagePreview({ control, name, alt, width, height }: { control: any; name: "brand.logo.src" | "brand.favicon.src"; alt: string; width: number; height: number; }) {
    const src = useWatch({ control, name });

    if (!src || typeof src !== 'string' ) {
        return <div className="h-10 w-24 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">No preview</div>;
    }
    
    const isValidSrc = src.startsWith('http') || src.startsWith('/');

    if (!isValidSrc) {
        return <div className="h-10 w-24 bg-red-100 rounded flex items-center justify-center text-xs text-red-500 text-center p-1">Invalid Path</div>;
    }

    return (
        <div className="p-2 border rounded-md bg-slate-50">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="object-contain"
                unoptimized // External URLs may not be in next.config.js
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
        </div>
    );
}

export default function SiteSeoPageWrapper() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings()
      .then(data => {
        setInitialData(data);
      })
      .catch(err => {
        setError(err.message);
        setInitialData(SiteSettingsSchema.parse({})); // Fallback to default on error
      })
  }, []);

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
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
        </div>
    );
  }

  return <SiteSeoForm initialData={initialData} />;
}


export function SiteSeoForm({ initialData }: { initialData: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: SiteSettings) {
    setIsSaving(true);
    try {
        const result = await saveSiteSettings(values);
        if (!result) { // Assuming saveSiteSettings returns null/undefined on error
            throw new Error("An unknown error occurred during save.");
        }
        toast({ title: "✅ Success", description: "Site settings saved." });
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Site Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="siteTitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Site Title</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g., Digifly" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="social.tagline" render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g., Strategy, Software & AI" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="brand.logo.src" render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                 <div className="flex items-start gap-4">
                  <FormControl className="flex-1"><Input type="text" {...field} value={field.value ?? ""} placeholder="https://... or /logo.svg" /></FormControl>
                  <ImagePreview control={form.control} name="brand.logo.src" alt="Logo Preview" width={120} height={40} />
                </div>
                <FormDescription>Accepts https://... or /path/to/logo.svg</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="brand.favicon.src" render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <div className="flex items-start gap-4">
                  <FormControl><Input type="text" {...field} value={field.value ?? ""} placeholder="/favicon.ico" /></FormControl>
                  <ImagePreview control={form.control} name="brand.favicon.src" alt="Favicon Preview" width={32} height={32} />
                </div>
                <FormDescription>Accepts https://... or /path/to/favicon.ico</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Default SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="defaultSeo.description" render={({ field }) => (
              <FormItem>
                <FormLabel>Default Meta Description</FormLabel>
                <FormControl><Textarea {...field} value={field.value ?? ""} placeholder="A concise summary for search engines." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-slate-50/90 py-4 dark:bg-slate-900/90">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
