
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { NavEditor as NavEditorComponent } from "./components/NavEditor";
import { NavigationSchema, type Navigation } from "@/lib/schemas";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

type NavEditorProps = {
  initialData: Navigation;
  onSave: (data: Navigation) => Promise<void>;
  isSaving: boolean;
};

export default function NavEditor({ initialData, onSave, isSaving }: NavEditorProps) {
  const methods = useForm<Navigation>({
    resolver: zodResolver(NavigationSchema),
    defaultValues: initialData ?? defaultNavigation,
    mode: "onChange",
  });

  const [isPending, startTransition] = useTransition();
  const combinedPending = isPending || isSaving;

  const onSubmit = methods.handleSubmit((values) => {
    startTransition(async () => {
      await onSave(values);
      methods.reset(values); // Re-sync to clear isDirty state after successful save
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
            <Button type="submit" disabled={combinedPending || !methods.formState.isDirty}>
                {combinedPending ? "Saving..." : "Save Navigation"}
            </Button>
        </div>
      </form>
    </FormProvider>
  );
}
