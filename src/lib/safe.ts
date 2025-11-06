export const safeStr = (v?: string | null, d = "") =>
  (typeof v === "string" && v.trim()) ? v : d;

export const safeAlt = (alt?: string | null, title?: string) =>
  safeStr(alt, safeStr(title, "Image"));
