
import type { SiteSettings } from "@/lib/schemas";

export function tokensFromSettings(s: SiteSettings){
  const out: Record<string,string> = {};
  
  // Use fallbacks to avoid errors if the structure is not yet populated
  const colors = (s as any).colors ?? {};
  const typography = (s as any).typography ?? {};

  // Colors
  if(colors.primary) out["--color-primary"] = colors.primary;
  if(colors.accent)  out["--color-accent"]  = colors.accent;
  if(colors.bg)      out["--color-bg"]      = colors.bg;
  if(colors.muted)   out["--color-muted"]   = colors.muted;

  // Typography
  if(typography.headline) out["--font-headline"] = typography.headline;
  if(typography.body)     out["--font-body"]     = typography.body;
  
  return out;
}


export function applyTokens(vars: Record<string,string>){
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for(const [k,v] of Object.entries(vars)){
    root.style.setProperty(k,v);
  }
}
