
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
        />
    );
}

export default function SeoTab() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
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
                <FormLabel>Default Title</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="Digifly | Your Partner in Digital Growth" value={field.value ?? ""} />
                </FormControl>
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
        </CardContent>
        </Card>
        <section className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Live SEO Preview</h3>
            <p className="text-sm text-slate-500 mb-4">This is how your site will generally appear on Google and social media, using the fields above.</p>
            <WatchedSeoPreview />
        </section>
    </div>
  );
}
