
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function GeneralTab() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Site Identity</CardTitle>
        <CardDescription>
          This is the main title and branding for your site, used in browser tabs and metadata.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="general.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Title</FormLabel>
              <FormControl>
                <Input placeholder="Digifly | Flow. Digitalisér. Skalér." {...field} />
              </FormControl>
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
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Link to your logo image file (e.g., SVG, PNG).</FormDescription>
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
                <Input placeholder="https://.../favicon.ico" {...field} />
              </FormControl>
              <FormDescription>Link to your site's favicon (e.g., ICO, PNG, SVG).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
