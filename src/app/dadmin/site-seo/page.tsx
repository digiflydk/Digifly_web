
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

async function safeGetSite(): Promise<SiteSettings> {
  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 8000); // 8s hard timeout

  try {
    const res = await fetch('/api/cms/site', {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: ctrl.signal,
    });
    clearTimeout(timeoutId);
    
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      const txt = await res.text().catch(() => '');
      throw new Error(`API response was not valid JSON (status ${res.status}). Snippet: ${txt.slice(0,120)}`);
    }

    const data = await res.json();

    if (!res.ok || !data?.ok) {
      const msg = data?.error
        ? `${res.status} • ${data.error}${data.detail ? ` • ${JSON.stringify(data.detail)}` : ''}`
        : `${res.status} • ${res.statusText || 'Unknown error'}`;
      throw new Error(`Load failed (/api/cms/site): ${msg}`);
    }
    return data.site;
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error(`Load failed: Request timed out after 8 seconds.`);
    }
    throw e;
  }
}

async function saveSettings(payload: SiteSettings): Promise<any> {
    const url = "/api/cms/site";
    const res = await fetch(url, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson && text ? JSON.parse(text) : null;

    if (!res.ok || data?.ok === false) {
        let errorMsg = `Save failed (${url}): ${res.status}`;
        if (data?.error) {
            errorMsg += ` • ${data.error}`;
        } else if (!isJson && text) {
            errorMsg += ` • ${text.slice(0, 200)}`;
        } else {
            errorMsg += ` • ${res.statusText}`;
        }
        if (data?.detail) {
            const detail = Array.isArray(data.detail) 
                ? data.detail.map((d: any) => `${d.path.join('.')}: ${d.message}`).join(', ')
                : String(data.detail);
            errorMsg += ` (${detail})`;
        }
        throw new Error(errorMsg);
    }
    return data;
}


export default function SiteSeoPageWrapper() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    safeGetSite()
      .then(data => {
        const parsedData = SiteSettingsSchema.partial().parse(data || {});
        setInitialData(parsedData as SiteSettings);
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
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
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
    resolver: zodResolver(SiteSettingsSchema.partial()),
    defaultValues: initialData,
  });

  async function onSubmit(values: Partial<SiteSettings>) {
    setIsSaving(true);
    try {
      await saveSettings(values as SiteSettings);
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
                <FormControl><Input type="url" {...field} value={field.value ?? ""} placeholder="https://..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="brand.favicon.src" render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <FormControl><Input type="url" {...field} value={field.value ?? ""} placeholder="https://.../favicon.ico" /></FormControl>
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
