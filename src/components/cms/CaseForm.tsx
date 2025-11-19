
"use client";

import * as React from "react";
import { z } from "zod";
import { CaseSchema, type CaseDoc } from "@/lib/schemas.case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createCaseAction, updateCaseAction } from "@/app/dadmin/cases/actions";
import { toast } from "@/hooks/use-toast";
import { getCaseById } from "@/lib/cms-api";


const emptyCase: CaseDoc = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  coverImage: { src: "", alt: "" },
  gallery: [],
  client: "",
  featured: false,
  published: true,
  seo: { title: "", description: "", image: "" },
};

export default function CaseForm(props: { caseId?: string }) {
  const router = useRouter();
  const [data, setData] = React.useState<CaseDoc>(emptyCase);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!props.caseId) return;
    (async () => {
      // getCaseById is safe for client if it fetches from an API route
      const item = await getCaseById(props.caseId as string);
      if (item) {
        setData(item as CaseDoc);
      } else {
        toast({ title: "Error", description: "Failed to load case data.", variant: 'destructive' });
      }
    })();
  }, [props.caseId]);

  function set<K extends keyof CaseDoc>(key: K, value: CaseDoc[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setBusy(true);
    setErrors({});
    try {
      const parsed = CaseSchema.safeParse(data);
      if (!parsed.success) {
        const es: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          es[i.path.join(".")] = i.message;
        });
        setErrors(es);
        return;
      }

      const action = props.caseId ? updateCaseAction : createCaseAction;
      const result = await action(parsed.data);

      if (!result.ok) {
        throw new Error(result.error || "Failed to save case study");
      }

      toast({ title: "Success", description: "Case study saved." });
      router.push("/dadmin/cases");
      router.refresh();
    } catch(e: any) {
       toast({ title: "Error", description: e.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => {
              const title = e.target.value;
              set("title", title);
              if (!props.caseId && !data.slug) {
                set("slug", title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
              }
            }}
          />
          {errors["title"] && <p className="text-sm text-destructive mt-1">{errors["title"]}</p>}
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={data.slug} onChange={(e) => set("slug", e.target.value)} />
          {errors["slug"] && <p className="text-sm text-destructive mt-1">{errors["slug"]}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Client</Label>
          <Input value={data.client || ""} onChange={(e) => set("client", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Published</Label>
            <select
              className="w-full h-10 rounded-md border bg-background px-3"
              value={data.published ? "yes" : "no"}
              onChange={(e) => set("published", e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <Label>Featured</Label>
            <select
              className="w-full h-10 rounded-md border bg-background px-3"
              value={data.featured ? "yes" : "no"}
              onChange={(e) => set("featured", e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <Label>Excerpt</Label>
        <Textarea rows={3} value={data.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>

      <div>
        <Label>Body</Label>
        <Textarea rows={8} value={data.body} onChange={(e) => set("body", e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Cover image URL</Label>
          <Input
            value={data.coverImage?.src || ""}
            onChange={(e) => set("coverImage", { ...data.coverImage, src: e.target.value })}
            placeholder="/placeholder/case-cover.webp"
          />
          {errors["coverImage.src"] && (
            <p className="text-sm text-destructive mt-1">{errors["coverImage.src"]}</p>
          )}
        </div>
        <div>
          <Label>Cover image alt</Label>
          <Input
            value={data.coverImage?.alt || ""}
            onChange={(e) => set("coverImage", { ...data.coverImage, alt: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label>SEO title</Label>
          <Input
            value={data.seo?.title || ""}
            onChange={(e) => set("seo", { ...data.seo, title: e.target.value })}
          />
        </div>
        <div>
          <Label>SEO description</Label>
          <Input
            value={data.seo?.description || ""}
            onChange={(e) => set("seo", { ...data.seo, description: e.target.value })}
          />
        </div>
        <div>
          <Label>SEO image URL</Label>
          <Input
            value={data.seo?.image || ""}
            onChange={(e) => set("seo", { ...data.seo, image: e.target.value })}
            placeholder="/placeholder/seo.webp"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button disabled={busy} onClick={submit}>
          {busy ? "Saving..." : "Save"}
        </Button>
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
