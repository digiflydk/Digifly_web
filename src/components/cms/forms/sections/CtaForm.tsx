
"use client";
import { useFormContext } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkPicker } from "../../inputs/LinkPicker";

export default function CtaForm() {
  const { control } = useFormContext<HomePage>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>CTA Banner</CardTitle>
        <CardDescription>Configure the main call-to-action banner at the bottom of the page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          name="cta.text"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CTA Text</FormLabel>
              <FormControl><Input placeholder="Let's build something..." {...field} value={field.value ?? ""} /></FormControl>
            </FormItem>
          )}
        />
        <div className="pt-2">
            <FormLabel>CTA Button</FormLabel>
            <LinkPicker namePrefix="cta.button" />
        </div>
      </CardContent>
    </Card>
  );
}
