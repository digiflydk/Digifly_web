
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
    const { control, getValues } = useFormContext();
    const seoWatch = useWatch({ control, name: "seo" });
    const siteTitleWatch = useWatch({ control, name: "general.title" });

    const seoForPreview = withSeoDefaults(seoWatch);

    return (
        <LiveSeoPreview
            seo={seoForPreview}
            fallbackTitle={siteTitleWatch || getValues("general.title") || "Site"}
            fallbackDescription={getValues("seo.defaultDescription") || ""}
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
                name="seo.defaultTitleTemplate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Default Title Template</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="%s | Company Name" />
                    </FormControl>
                    <FormDescription>
                        <code>%s</code> will be replaced with the page-specific title.
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
                        <Textarea {...field} placeholder="A short, compelling description of your site." />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="seo.ogImageUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Default Social Image URL</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="https://.../og-image.png" />
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
        <div className="md:col-span-1 md:sticky top-24">
            <h3 className="text-lg font-semibold mb-2">Live SEO Preview</h3>
            <p className="text-sm text-slate-500 mb-4">This is how your site will generally appear on Google and social media.</p>
            <WatchedSeoPreview />
        </div>
    </div>
  );
}
