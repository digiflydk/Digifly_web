
"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { HomePage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkPicker } from "../../inputs/LinkPicker";

export default function CtaForm() {
  const { control } = useFormContext<HomePage>();

  // DGF-362: Use useFieldArray to manage the featuredCases array
  const { fields, update, remove, append } = useFieldArray({
    control,
    name: "featuredCases",
  });

  return (
    <div className="space-y-6">
        {/* Main CTA Banner */}
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

        {/* Featured Cases Section */}
        <Card>
            <CardHeader>
                <CardTitle>Featured Cases</CardTitle>
                <CardDescription>Enter the slugs for the 3 case studies to feature on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        name={`featuredCases.${index}`}
                        control={control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Case Study Slug #{index + 1}</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., autostream-ai" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </CardContent>
        </Card>
    </div>
  );
}
