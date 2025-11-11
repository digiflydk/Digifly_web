
"use client";

import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getPublishedPagesList } from "@/lib/cms-server";
import { Skeleton } from "@/components/ui/skeleton";
import { File, Globe } from "lucide-react";

type PageInfo = { id: string; title: string; path: string };

type LinkPickerProps = {
  namePrefix: string;
};

export function LinkPicker({ namePrefix }: LinkPickerProps) {
  const { control, setValue } = useFormContext();
  const [pages, setPages] = useState<PageInfo[] | null>(null);

  const type = useWatch({ control, name: `${namePrefix}.type` });

  useEffect(() => {
    getPublishedPagesList().then(setPages);
  }, []);

  const handleTypeChange = (newType: 'internal' | 'external') => {
    setValue(`${namePrefix}.type`, newType, { shouldDirty: true });
    if (newType === 'internal') {
        setValue(`${namePrefix}.externalUrl`, '', { shouldDirty: true });
    } else {
        setValue(`${namePrefix}.internalRef`, null, { shouldDirty: true });
    }
  };
  
  return (
    <div className="space-y-4 rounded-md border p-4">
      <FormField
        control={control}
        name={`${namePrefix}.label`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl><Input {...field} placeholder="e.g. Learn More" value={field.value ?? ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name={`${namePrefix}.type`}
        render={({ field }) => (
            <FormItem>
                <FormLabel>Link Type</FormLabel>
                 <Select onValueChange={handleTypeChange} value={field.value ?? 'internal'}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a link type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="internal"><div className="flex items-center gap-2"><File className="h-4 w-4" /> Internal Page</div></SelectItem>
                        <SelectItem value="external"><div className="flex items-center gap-2"><Globe className="h-4 w-4" /> External URL</div></SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
      />

      {type === 'internal' && (
        <FormField
          control={control}
          name={`${namePrefix}.internalRef`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page</FormLabel>
              {pages === null ? <Skeleton className="h-10 w-full" /> : (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a page" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {pages.map(p => <SelectItem key={p.id} value={p.id}>{p.title} ({p.path})</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {type === 'external' && (
        <FormField
          control={control}
          name={`${namePrefix}.externalUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl><Input {...field} placeholder="https://example.com" value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name={`${namePrefix}.newTab`}
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 pt-2">
            <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} id={`${namePrefix}-new-tab`} /></FormControl>
            <Label htmlFor={`${namePrefix}-new-tab`} className="!mt-0">Open in new tab</Label>
          </FormItem>
        )}
      />
    </div>
  );
}
