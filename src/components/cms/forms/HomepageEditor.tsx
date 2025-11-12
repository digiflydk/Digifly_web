
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HomePage } from "@/lib/types";
import { HomepageSchema } from "@/lib/schemas";
import HeroForm from "./sections/HeroForm";
import WhatWeDoForm from "./sections/WhatWeDoForm";
import ServicesForm from "./sections/ServicesForm";
import CtaForm from "./sections/CtaForm";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";
import { saveHomepageAction } from "@/app/dadmin/homepage/actions";
import deepmerge from 'deepmerge';

export default function HomepageEditor({ initialData }: { initialData: HomePage }) {
  const methods = useForm<HomePage>({
    resolver: zodResolver(HomepageSchema),
    defaultValues: deepmerge(defaultHomepage, initialData || {}),
    mode: "onChange",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = methods.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await saveHomepageAction(data);

        if (!result.ok) {
            throw new Error("Save failed");
        }
        
        toast({ title: "Saved", description: "Homepage updated." });
        methods.reset(data);

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
