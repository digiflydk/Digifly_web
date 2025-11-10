
"use client";
import React from "react";
import { withSeoDefaults } from "@/lib/seo-defaults";

type Props = {
  seo?: {
    title?: string;
    description?: string;
    ogImageUrl?: string | null;
  } | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  siteUrl?: string;
};

export function LiveSeoPreview({ seo, fallbackTitle = "", fallbackDescription = "", siteUrl = "" }: Props) {
  const safe = withSeoDefaults(seo);
  const title = safe.title || fallbackTitle;
  const description = safe.description || fallbackDescription;
  
  let imageSrc = safe.ogImage?.src || "";
  if (imageSrc && imageSrc.startsWith('/')) {
    imageSrc = `${siteUrl}${imageSrc}`;
  }

  const imageAlt = safe.ogImage?.alt || "";

  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-muted-foreground mb-2">Preview</div>
      <div className="space-y-2">
        <div className="font-medium leading-tight">{title || "Untitled page"}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {description || "No description yet."}
        </div>
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={imageAlt || "Open Graph image"} className="mt-2 w-full max-w-md rounded-md" />
        ) : (
          <div className="mt-2 h-24 w-full max-w-md rounded-md bg-muted grid place-items-center text-xs text-muted-foreground">
            No OG image selected
          </div>
        )}
      </div>
    </div>
  );
}
