"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { saveNavigationAction } from "./actions";
import { NavEditor as NavEditorComponent } from "./components/NavEditor";
import { NavigationSchema, type Navigation } from "@/lib/schemas";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";
import { Button } from "@/components/ui/button";

export default function NavEditor({ initialData }: { initialData: Navigation | null }) {
  const methods = useForm<Navigation>({
    resolver: zodResolver(NavigationSchema),
    defaultValues: initialData ?? defaultNavigation,
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = methods.handleSubmit((values) => {
    startTransition(async () => {
      try {
        const res = await saveNavigationAction(values);
        if (res?.ok) {
          toast({ title: "Saved", description: "Navigation updated." });
          methods.reset(values); // Re-sync to clear isDirty state
        } else {
          throw new Error(res?.error || "Save failed on the server.");
        }
      } catch (e: any) {
        toast({
          title: "Error",
          description: e?.message ?? "Could not save navigation.",
          variant: "destructive",
        });
      }
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-8">
        <NavEditorComponent
          title="Primary Navigation"
          items={methods.watch('header')}
          onSaveKey="header"
          initialData={initialData ?? defaultNavigation}
        />
        <NavEditorComponent
          title="Footer Navigation"
          description="Manage the first column of links in the footer."
          items={methods.watch('footer.columns.0.links')}
          onSaveKey="footer"
          initialData={initialData ?? defaultNavigation}
        />
        <div className="sticky bottom-0 bg-slate-50/90 py-4 dark:bg-slate-900/90 border-t -mx-6 px-6">
            <Button type="submit" disabled={isPending || !methods.formState.isDirty}>
                {isPending ? "Saving..." : "Save Navigation"}
            </Button>
        </div>
      </form>
    </FormProvider>
  );
}
