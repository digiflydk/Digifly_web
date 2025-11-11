
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePreview } from "../components/ImagePreview";

export default function GeneralTab() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Site Branding</CardTitle>
        <CardDescription>
          This is the main branding for your site, used in the header and footer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="general.brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Digifly" {...field} value={field.value ?? ""} />
              </FormControl>
               <FormDescription>
                Used when a logo is not present.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="general.logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>Used in header and mobile menu.</FormDescription>
              <ImagePreview url={field.value} alt="Logo" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="general.faviconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favicon URL</FormLabel>
              <FormControl>
                <Input placeholder="https://.../favicon.ico" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>Shown in browser tab. Use PNG/ICO/SVG.</FormDescription>
              <ImagePreview url={field.value} alt="Favicon" />
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
