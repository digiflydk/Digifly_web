"use client";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { tokensFromSettings, applyTokens } from "@/lib/design-tokens";
import type { DesignSettings } from "@/lib/types";

export default function DesignTokensClient(){
  useEffect(()=>{
    const ref = doc(db,"content/settings","design");
    const unsub = onSnapshot(ref,(snap)=>{
      const data = snap.data() as DesignSettings | undefined;
      if(data){
        const vars = tokensFromSettings(data);
        applyTokens(vars);
      }
    });
    return ()=>unsub();
  },[]);
  return null;
}
