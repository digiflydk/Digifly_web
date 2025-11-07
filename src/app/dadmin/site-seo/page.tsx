
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

async function loadSettings(): Promise<Partial<SiteSettings>> {
    const res = await fetch("/api/cms/site", { cache: "no-store" });
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        const text = await res.text().catch(() => '');
        throw new Error(`API response was not valid JSON (status ${res.status}). Snippet: ${text.slice(0, 120)}`);
    }

    const json = await res.json();
    if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Request failed with status ${res.status}`);
    }
    return json.data;
}

async function saveSettings(payload: any) {
    const res = await fetch("/api/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.ok) {
        let errorMsg = json?.error || `Request failed with status ${res.status}`;
        if (json.detail && Array.isArray(json.detail)) {
            errorMsg += ` - ${json.detail.map((d: any) => d.message).join(', ')}`;
        }
        throw new Error(errorMsg);
    }
    return json.data;
}


export default function SiteSeoPageWrapper() {
  const [initialData, setInitialData] = useState<Partial<SiteSettings> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings()
      .then(data => {
        const parsedData = SiteSettingsSchema.partial().parse(data || {});
        setInitialData(parsedData);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
        </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Failed to Load Settings</AlertTitle>
        <AlertDescription className="break-all">{error}</AlertDescription>
      </Alert>
    )
  }

  return <SiteSeoForm initialData={initialData || {}} />;
}


export function SiteSeoForm({ initialData }: { initialData: Partial<SiteSettings> }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: SiteSettings) {
    setIsSaving(true);
    try {
      await saveSettings(values);
      toast({ title: "Success", description: "Site settings saved." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Could not save settings.", variant: "destructive" });
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
          <CardContent className="space-y-4">
            <FormField control={form.control} name="brand.logo.src" render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl><Input type="url" {...field} value={field.value ?? ""} placeholder="https://... or /logo.svg" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="brand.favicon.src" render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <FormControl><Input type="url" {...field} value={field.value ?? ""} placeholder="https://... or /favicon.ico" /></FormControl>
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
