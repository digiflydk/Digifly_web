
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationSchema, type Navigation } from "@/lib/schemas";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveNavigationAction } from "@/app/dadmin/navigation/actions";
import NavItemsList from "./NavItemsList";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

type PageInfo = { id: string; title: string; path: string };

export default function NavEditor({ initialData, pages }: {
  initialData: Navigation | null;
  pages: PageInfo[];
}) {
  const methods = useForm<Navigation>({
    resolver: zodResolver(NavigationSchema),
    defaultValues: initialData ?? defaultNavigation,
    mode: "onChange",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = methods.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await saveNavigationAction(data);
        if (result.ok) {
          toast({ title: "Saved", description: "Navigation updated." });
          methods.reset(data);
        } else {
          throw new Error(result.error || "An unknown error occurred.");
        }
      } catch (e: any) {
        toast({ title: "Error", description: e?.message ?? "Save failed", variant: "destructive" });
      }
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-8">
        <NavItemsList title="Primary Navigation" namePrefix="header" pages={pages} />
        <NavItemsList title="Footer Navigation" namePrefix="footer.columns.0.links" pages={pages} />
        
        <div className="sticky bottom-0 bg-slate-50/90 py-4 dark:bg-slate-900/90 border-t -mx-6 px-6">
          <Button type="submit" disabled={isPending || !methods.formState.isDirty}>
            {isPending ? "Saving..." : "Save Navigation"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
