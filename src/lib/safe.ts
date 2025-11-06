export const safeStr = (v: string | null | undefined, d = "") =>
  (typeof v === "string" && v.trim().length > 0) ? v : d;

export const safeAlt = (alt?: string | null, title?: string) =>
  safeStr(alt, safeStr(title, "Image"));