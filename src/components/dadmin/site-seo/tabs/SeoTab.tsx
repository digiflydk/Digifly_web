
"use client";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LiveSeoPreview } from "@/components/cms/forms/SeoPreviewCard";
import { withSeoDefaults } from "@/lib/seo-defaults";

function WatchedSeoPreview() {
    const { getValues } = useFormContext();
    // Watch the entire form to trigger re-renders
    const formValues = useWatch();

    const title = formValues.seo?.defaultTitle || formValues.general?.title || '';
    const description = formValues.seo?.defaultDescription || '';
    const ogImage = formValues.seo?.ogImage || '';
    
    // Create a temporary object for the preview component
    const seoForPreview = {
        title: title,
        description: description,
        ogImage: { src: ogImage, alt: title }
    };

    return (
        <LiveSeoPreview
            seo={seoForPreview}
            fallbackTitle={title}
            fallbackDescription={description}
            siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
        />
    );
}

export default function SeoTab() {
  const { control } = useFormContext();

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Default SEO Settings</CardTitle>
                <CardDescription>
                These are the fallback settings for pages that don't have their own specific SEO metadata.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={control}
                    name="seo.defaultTitle"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Default Page Title</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Digifly | Digital Solutions" value={field.value ?? ""} />
                        </FormControl>
                        <FormDescription>
                            Used as the base title for all pages.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                control={control}
                name="seo.defaultDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Default Meta Description</FormLabel>
                    <FormControl>
                        <Textarea {...field} placeholder="A short, compelling description of your site." value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="seo.ogImage"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Default Social Image URL</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="https://.../og-image.png" value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>
                        Recommended size: 1200x630px.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={control}
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
        </div>
        <aside className="md:col-span-1 md:sticky top-24 space-y-4">
            <h3 className="text-lg font-semibold">Live SEO Preview</h3>
            <p className="text-sm text-slate-500">This is how your site will generally appear on Google and social media.</p>
            <WatchedSeoPreview />
        </aside>
    </div>
  );
}
