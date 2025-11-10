
"use client";
import * as React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function OpeningHoursTab() {
  const { control } = useFormContext();
  
  // We model this as an object in the schema, so we can't use useFieldArray.
  // We'll just map over the day names.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opening Hours</CardTitle>
        <CardDescription>
          Set your business hours. This data can be used for structured data (JSON-LD).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dayMap.map((dayName, index) => (
          <div key={dayName} className="grid grid-cols-4 items-center gap-4 p-3 rounded-lg hover:bg-slate-50">
            <div className="col-span-1">
              <FormField
                control={control}
                name={`openingHours.${dayName.toLowerCase()}.open`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-semibold !mt-0">{dayName}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                control={control}
                name={`openingHours.${dayName.toLowerCase()}`}
                render={({ field: parentField }) => (
                  <div className={cn("flex items-center gap-2", !parentField.value.open && "opacity-40 pointer-events-none")}>
                    <FormField
                      control={control}
                      name={`openingHours.${dayName.toLowerCase()}.from`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl><Input type="time" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-muted-foreground">-</span>
                    <FormField
                      control={control}
                      name={`openingHours.${dayName.toLowerCase()}.to`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl><Input type="time" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
