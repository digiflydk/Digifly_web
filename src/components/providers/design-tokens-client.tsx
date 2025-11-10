
"use client";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { tokensFromSettings } from "@/lib/design-tokens";
import type { SiteSettings } from "@/lib/schemas";
import { applyTokens } from "@/lib/design-tokens";

export default function DesignTokensClient({ settings }: { settings: SiteSettings }){
  useEffect(()=>{
    if (settings) {
        const vars = tokensFromSettings(settings);
        applyTokens(vars);
    }
    const ref = doc(db,"site","settings");
    const unsub = onSnapshot(ref,(snap)=>{
      const data = snap.data() as SiteSettings | undefined;
      if(data){
        const vars = tokensFromSettings(data);
        applyTokens(vars);
      }
    });
    return ()=>unsub();
  },[settings]);
  return null;
}
