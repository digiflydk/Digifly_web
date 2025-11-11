
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsSchema, type SiteSettings } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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

      const text = await res.text();
      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson && text ? JSON.parse(text) : null;

      if (!res.ok || data?.ok === false) {
        const msg = data?.error?.message ?? data?.error ?? `${res.status} ${res.statusText}${!isJson && text ? ` • ${text.slice(0,200)}` : ""}`;
        throw new Error(`Save failed (${url}): ${msg}`);
      }
      
      toast({ title: "Success", description: "Site settings saved and will be live shortly." });
      form.reset(values); // Re-sync form state to clear dirty state
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
          <CardHeader><CardTitle>General Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <FormField control={form.control} name="general.brandName" render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl><Input {...field} value={String(field.value ?? "")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="general.logoUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl><Input {...field} value={String(field.value ?? "")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="general.faviconUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <FormControl><Input {...field} value={String(field.value ?? "")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Default SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="seo.defaultTitle" render={({ field }) => (
              <FormItem>
                <FormLabel>Default SEO Title</FormLabel>
                <FormControl><Input {...field} value={String(field.value ?? "")} /></FormControl>
                 <FormDescription>Fallback title used for pages without specific SEO settings.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="seo.defaultDescription" render={({ field }) => (
              <FormItem>
                <FormLabel>Default Meta Description</FormLabel>
                <FormControl><Textarea {...field} value={String(field.value ?? "")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="seo.ogImage" render={({ field }) => (
              <FormItem>
                <FormLabel>Default Social Image (OG)</FormLabel>
                <FormControl><Input {...field} value={String(field.value ?? "")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="seo.canonicalBase" render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical Base URL</FormLabel>
                <FormControl><Input {...field} value={String(field.value ?? "")} /></FormControl>
                 <FormDescription>The root URL for your production site, e.g., https://www.digifly.dk</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
             <FormField
                control={form.control}
                name="seo.allowIndexing"
                render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Indexing</FormLabel>
                    <FormDescription>
                        Allow search engines like Google to index your site. Turn this off for staging sites.
                    </FormDescription>
                    </div>
                    <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                </FormItem>
                )}
            />
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-slate-50/90 py-4">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
