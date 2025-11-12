
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { NavEditor as NavEditorComponent } from "./components/NavEditor";
import { NavigationSchema, type Navigation } from "@/lib/schemas";
import { defaultNavigation } from "@/lib/defaults/siteDefaults";

type NavEditorProps = {
  value: Navigation;
  onChange: (data: Navigation) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

export default function NavEditor({ value, onChange, onSave, saving }: NavEditorProps) {
  const methods = useForm<Navigation>({
    resolver: zodResolver(NavigationSchema),
    values: value, // Use values to sync with parent state
    mode: "onChange",
  });

  const isDirty = methods.formState.isDirty;

  // Sync parent state with form state
  const subscription = methods.watch((formValues) => {
    onChange(formValues as Navigation);
  });
  // React.useEffect(() => () => subscription.unsubscribe(), [subscription]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-8">
        <NavEditorComponent
          title="Primary Navigation"
          items={value.header}
          onSaveKey="header"
          initialData={value}
        />
        <NavEditorComponent
          title="Footer Navigation"
          description="Manage the first column of links in the footer."
          items={value.footer.columns[0]?.links ?? []}
          onSaveKey="footer"
          initialData={value}
        />
        <div className="sticky bottom-0 bg-slate-50/90 py-4 dark:bg-slate-900/90 border-t -mx-6 px-6">
            <Button type="submit" disabled={saving || !isDirty}>
                {saving ? "Saving..." : "Save Navigation"}
            </Button>
        </div>
      </form>
    </FormProvider>
  );
}
