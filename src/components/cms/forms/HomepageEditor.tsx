
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HomePage } from "@/lib/types";
import { HomepageSchema } from "@/data/schemas";
import HeroForm from "./sections/HeroForm";
import WhatWeDoForm from "./sections/WhatWeDoForm";
import ServicesForm from "./sections/ServicesForm";
import CtaForm from "./sections/CtaForm";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { defaultHomepage } from "@/data/defaults";
import { saveHomepageAction } from "@/app/dadmin/homepage/actions";
import deepmerge from 'deepmerge';

// DGF-372: Custom merge strategy to ensure arrays from initialData overwrite defaults.
const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: deepmerge.Options): any[] => sourceArray;

export default function HomepageEditor({ initialData }: { initialData: HomePage }) {
  const methods = useForm<HomePage>({
    resolver: zodResolver(HomepageSchema),
    // DGF-372: Apply the overwrite merge strategy here.
    defaultValues: deepmerge(defaultHomepage, initialData || {}, {
      arrayMerge: overwriteMerge
    }),
    mode: "onChange",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = methods.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await saveHomepageAction(data);
        if (result.ok) {
            toast({ title: "Saved", description: "Homepage updated." });
            methods.reset(data); // Re-sync form with saved data to clear dirty state
        } else {
            // Use the more specific error from the server action if available
            const errorMessage = result.error || "An unknown error occurred during save.";
            throw new Error(errorMessage);
        }
      } catch (e: any) {
        toast({ title: "Error", description: e?.message ?? "Save failed", variant: "destructive" });
      }
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="whatwedo">What We Do</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          <TabsContent value="hero"><HeroForm /></TabsContent>
          <TabsContent value="whatwedo"><WhatWeDoForm /></TabsContent>
          <TabsContent value="services"><ServicesForm /></TabsContent>
          <TabsContent value="cta"><CtaForm /></TabsContent>
        </Tabs>

        <div className="sticky bottom-0 bg-slate-50/90 py-4 dark:bg-slate-900/90 border-t -mx-6 px-6">
          <Button type="submit" disabled={isPending || !methods.formState.isDirty}>
            {isPending ? "Saving…" : "Save Homepage"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
