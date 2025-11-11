

"use client";
import { useState } from "react";
import { updateCase } from "@/lib/cms-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import type { Case } from "@/lib/schemas";


export default function CaseEditor({ id, initial }: { id: string; initial: Case | null }) {
  const [model, setModel] = useState<Case>(
    initial ?? {
      id,
      title: "",
      slug: "",
      published: false,
      status: "draft",
      excerpt: "",
      cover: { src: "", alt: "" },
      content: { body: [] },
      meta: { tags: [] },
    }
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      // DGF-298: Harden payload to ensure cover.src is a string
      const payload = {
        ...model,
        cover: model.cover
          ? { src: model.cover.src ?? "", alt: model.cover.alt }
          : { src: "", alt: "" },
      };
      await updateCase(id, payload);
      toast({ title: "Success", description: "Case study saved." });
    } catch (e: any) {
        toast({ title: "Error", description: e.message || "Could not save case study.", variant: "destructive" });
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Case</h1>
        <div className="space-x-2">
          <Link href="/dadmin/cases" className="text-sm underline">Back</Link>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label>Title</Label>
          <Input value={model.title} onChange={e=>setModel({...model, title: e.target.value})}/>
          <Label>Slug</Label>
          <Input value={model.slug} onChange={e=>setModel({...model, slug: e.target.value})}/>
          <Label>Status</Label>
          <select
            className="h-10 w-full rounded-md border px-3"
            value={model.status}
            onChange={(e)=>setModel({...model, status: e.target.value as any})}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <Label>Excerpt (max 300)</Label>
          <Textarea value={model.excerpt} onChange={e=>setModel({...model, excerpt: e.target.value})}/>
        </div>

        <div className="space-y-3">
          <Label>Cover URL</Label>
          <Input value={model.cover?.src ?? ""} onChange={e=>setModel({...model, cover: { src: e.target.value ?? "", alt: model.cover?.alt }})}/>
          <Label>Cover Alt</Label>
          <Input value={model.cover?.alt ?? ""} onChange={e=>setModel({...model, cover: { ...model.cover, alt: e.target.value, src: model.cover?.src ?? "" }})}/>
          <Label>Tags (comma separated)</Label>
          <Input
            value={model.meta?.tags?.join(", ") ?? ""}
            onChange={(e)=>setModel({...model, meta: { ...model.meta, tags: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) }})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Content (JSON)</Label>
        <Textarea 
          rows={14} 
          value={typeof model.content === 'string' ? model.content : JSON.stringify(model.content, null, 2)} 
          onChange={e => {
            try {
              const parsedContent = JSON.parse(e.target.value);
              setModel({...model, content: parsedContent });
            } catch {
              // Handle invalid JSON if needed, e.g. show an error
            }
          }}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">Content is temporarily editable as raw JSON.</p>
      </div>
    </div>
  );
}
