import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts CMYK color values to an RGBA CSS string.
 * @param c - Cyan value (0-100)
 * @param m - Magenta value (0-100)
 * @param y - Yellow value (0-100)
 * @param k - Key (black) value (0-100)
 * @param opacity - Alpha value (0-1)
 * @returns An `rgba(r, g, b, a)` CSS string.
 */
export function cmykToRgba(c: number, m: number, y: number, k: number, opacity = 1): string {
  const c_ = c / 100;
  const m_ = m / 100;
  const y_ = y / 100;
  const k_ = k / 100;

  const r = Math.round(255 * (1 - c_) * (1 - k_));
  const g = Math.round(255 * (1 - m_) * (1 - k_));
  const b = Math.round(255 * (1 - y_) * (1 - k_));
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
