"use client";
import { useMemo } from "react";
import docs from "@/data/developer-docs";
import DocCard from "./DocCard";

export default function DocsPageContent() {
  const items = useMemo(() => docs, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Developer documentation</h1>
        <p className="text-sm text-muted-foreground">
          Internal docs for Digifly admin. Status labels show if something is missing or OK.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((d) => (
          <DocCard key={d.slug} doc={d} />
        ))}
      </div>
    </div>
  );
}
