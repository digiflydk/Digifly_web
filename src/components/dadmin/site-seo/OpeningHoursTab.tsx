
"use client";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const dayMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function OpeningHoursTab() {
  const { control, watch } = useFormContext();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opening Hours</CardTitle>
        <CardDescription>
          Set your business hours. This data can be used for structured data (JSON-LD).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dayMap.map((dayName) => {
          const isChecked = watch(`openingHours.${dayName}.open`);
          return (
            <div key={dayName} className="grid grid-cols-4 items-center gap-4 p-3 rounded-lg hover:bg-slate-50">
              <div className="col-span-1">
                <FormField
                  control={control}
                  name={`openingHours.${dayName}.open`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-semibold !mt-0 capitalize">{dayName}</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className={cn("col-span-3 flex items-center gap-2", !isChecked && "opacity-40 pointer-events-none")}>
                  <FormField
                    control={control}
                    name={`openingHours.${dayName}.from`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl><Input type="time" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground">-</span>
                  <FormField
                    control={control}
                    name={`openingHours.${dayName}.to`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl><Input type="time" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
