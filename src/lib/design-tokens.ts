
import type { DesignSettings } from "@/lib/types";

export function tokensFromSettings(s: DesignSettings){
  const out: Record<string,string> = {};

  // Colors
  if(s.colors){
    // Canonical keys from schema
    if (s.colors.primary) out["--color-primary"] = s.colors.primary;
    if (s.colors.accent)  out["--color-accent"]  = s.colors.accent;
    if (s.colors.bg)      out["--color-bg"]      = s.colors.bg;
    if (s.colors.muted)   out["--color-muted"]   = s.colors.muted;

  }

  // Typography
  if(s.typography){
    if(s.typography.headline) out["--font-headline"] = s.typography.headline;
    if(s.typography.body)     out["--font-body"]     = s.typography.body;
  }
  
  return out;
}


export function applyTokens(vars: Record<string,string>){
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for(const [k,v] of Object.entries(vars)){
    root.style.setProperty(k,v);
  }
}
