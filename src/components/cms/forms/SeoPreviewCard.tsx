
"use client";
import { safeStr } from "@/lib/safe";
import Image from "next/image";

type SeoPreviewCardProps = {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  siteUrl?: string | null;
};

export function SeoPreviewCard({ title, description, imageUrl, siteUrl }: SeoPreviewCardProps) {
    const finalImageUrl = (imageUrl && (imageUrl.startsWith('/') ? `${siteUrl}${imageUrl}`: imageUrl)) || `${siteUrl}/og-default.jpg`;
    
    return (
        <div className="w-full max-w-lg rounded-lg border bg-slate-50 shadow-sm transition-all">
            <div className="aspect-[1.91/1] w-full overflow-hidden rounded-t-lg bg-slate-200">
                <Image
                    key={finalImageUrl}
                    src={finalImageUrl}
                    alt="SEO Preview"
                    width={500}
                    height={262}
                    className="h-full w-full object-cover"
                    unoptimized
                />
            </div>
            <div className="p-3">
                <p className="text-xs uppercase text-slate-500">{siteUrl?.replace(/https?:\/\//, '')}</p>
                <p className="mt-1 truncate font-semibold text-slate-800">{safeStr(title, "Your Site Title")}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {safeStr(description, "A compelling description of your site for search engines and social media.")}
                </p>
            </div>
        </div>
    );
}
