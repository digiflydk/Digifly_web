
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

export default function SiteSeoPageWrapper() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/cms/site')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setInitialData(data.site);
        } else {
          setInitialData({
            siteTitle: 'Digifly',
            tagline: '',
            logoUrl: '',
            faviconUrl: '',
            defaultDescription: '',
          });
          toast({
            title: "Error loading settings",
            description: data.error || "Could not fetch initial site settings.",
            variant: "destructive"
          });
        }
      })
  }, []);

  if (!initialData) {
    return <div>Loading form...</div>;
  }

  return (
    <>
      <SiteSeoForm initialData={initialData} />
    </>
  );
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
      const url = "/api/cms/site";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      let body: any = {};
      try {
        body = await res.json();
      } catch { /* ignore parsing error if body is not json */ }

      if (!res.ok || !body?.ok) {
        const msg = `Save failed (${url}): ${res.status} • ${body?.error ?? res.statusText}`;
        throw new Error(msg);
      }
      
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
                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tagline" render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="logoUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="faviconUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Default SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="defaultDescription" render={({ field }) => (
              <FormItem>
                <FormLabel>Default Meta Description</FormLabel>
                <FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-slate-50/90 py-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
