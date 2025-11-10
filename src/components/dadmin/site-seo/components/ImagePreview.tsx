"use client";
import Image from "next/image";

export function ImagePreview({ url, alt, className }: { url?: string; alt: string; className?: string }) {
  if (!url) return null;
  return (
    <div className={className ?? "mt-2 rounded-md border p-2 bg-muted/30"}>
      <div className="text-xs text-muted-foreground mb-2">{alt} preview</div>
      {/* Avoid layout shift and broken-src warnings */}
      <div className="relative h-16 w-16 overflow-hidden rounded bg-background">
        <Image
          src={url}
          alt={alt}
          fill
          sizes="64px"
          className="object-contain"
          onError={(e) => {
            // hide preview if the URL is bad
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </div>
  );
}
