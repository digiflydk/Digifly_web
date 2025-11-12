
"use client";
import { useEffect } from "react";
import { tokensFromSettings } from "@/lib/design-tokens";
import type { SiteSettings } from "@/lib/schemas";
import { applyTokens } from "@/lib/design-tokens";

export default function DesignTokensClient({ settings }: { settings: SiteSettings }){
  useEffect(()=>{
    if (settings) {
        const vars = tokensFromSettings(settings);
        applyTokens(vars);
    }
    // The onSnapshot listener has been removed to prevent client-side
    // permission errors. The component now relies on server-fetched props.
  },[settings]);
  return null;
}
