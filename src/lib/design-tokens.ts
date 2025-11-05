import type { DesignSettings } from "@/lib/types";

const px = (n: number | string) => (typeof n === "number" ? `${n}px` : String(n));

export function tokensFromSettings(s: DesignSettings){
  const out: Record<string,string> = {};

  // Colors
  if(s.colors){
    if(s.colors.primary)        out["--color-black"]     = s.colors.primary;
    if(s.colors.electricBlue)   out["--color-blue"]      = s.colors.electricBlue;
    if(s.colors.digitalPurple)  out["--color-purple"]    = s.colors.digitalPurple;
    if(s.colors.graphiteGrey)   out["--color-graphite"]  = s.colors.graphiteGrey;
    if(s.colors.platinumGrey)   out["--color-platinum"]  = s.colors.platinumGrey;
    if(s.colors.softWhite)      out["--color-softwhite"] = s.colors.softWhite;
    if(s.colors.success)        out["--color-success"]   = s.colors.success;
    if(s.colors.error)          out["--color-error"]     = s.colors.error;
  }

  // Typography
  if(s.typography){
    if(s.typography.headlineFont) out["--font-headline"] = s.typography.headlineFont;
    if(s.typography.bodyFont)     out["--font-body"]     = s.typography.bodyFont;

    if(s.typography.h1)      out["--fs-h1"]      = px(s.typography.h1);
    if(s.typography.h2)      out["--fs-h2"]      = px(s.typography.h2);
    if(s.typography.h3)      out["--fs-h3"]      = px(s.typography.h3);
    if(s.typography.body)    out["--fs-body"]    = px(s.typography.body);
    if(s.typography.caption) out["--fs-caption"] = px(s.typography.caption);
    if(s.typography.lineHeight) out["--lh-base"] = String(s.typography.lineHeight);
  }

  // Buttons
  if(s.buttons){
    if(s.buttons.radius!=null) out["--btn-radius"]=px(s.buttons.radius);
    if(s.buttons.primary){
      if(s.buttons.primary.bg)      out["--btn-primary-bg"]=s.buttons.primary.bg;
      if(s.buttons.primary.text)    out["--btn-primary-text"]=s.buttons.primary.text;
      if(s.buttons.primary.hoverBg) out["--btn-primary-hover-bg"]=s.buttons.primary.hoverBg;
    }
    if(s.buttons.secondary){
      if(s.buttons.secondary.border)  out["--btn-secondary-border"]=s.buttons.secondary.border;
      if(s.buttons.secondary.text)    out["--btn-secondary-text"]=s.buttons.secondary.text;
      if(s.buttons.secondary.hoverBg) out["--btn-secondary-hover-bg"]=s.buttons.secondary.hoverBg;
    }
    if(s.buttons.ghost){
      if(s.buttons.ghost.text)    out["--btn-ghost-text"]=s.buttons.ghost.text;
      if(s.buttons.ghost.hoverBg) out["--btn-ghost-hover-bg"]=s.buttons.ghost.hoverBg;
    }
  }
  return out;
}

export function applyTokens(vars: Record<string,string>){
  const root = document.documentElement;
  for(const [k,v] of Object.entries(vars)){
    root.style.setProperty(k,v);
  }
}
