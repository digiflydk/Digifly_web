
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ContactTab() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
            <FormField
            control={control}
            name="contact.email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="info@digifly.dk" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={control}
            name="contact.phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input placeholder="+45 12 34 56 78" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={control}
            name="contact.company"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                    <Input placeholder="Digifly ApS" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={control}
            name="contact.street"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                    <Input placeholder="Vejlebrovej 14K" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid md:grid-cols-3 gap-4">
            <FormField
                control={control}
                name="contact.zip"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>ZIP / Postal Code</FormLabel>
                    <FormControl>
                        <Input placeholder="2635" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="contact.city"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input placeholder="Ishøj" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="contact.country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input placeholder="Denmark" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
      </CardContent>
    </Card>
  );
}
