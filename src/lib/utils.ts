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

/**
 * Converts an RGB color value to CMYK.
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns An object with c, m, y, k values (0-100).
 */
export function rgbToCmyk(r: number, g: number, b: number): { c: number, m: number, y: number, k: number } {
    if (r === 0 && g === 0 && b === 0) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    const r_ = r / 255;
    const g_ = g / 255;
    const b_ = b / 255;

    const k = 1 - Math.max(r_, g_, b_);
    const c = (1 - r_ - k) / (1 - k);
    const m = (1 - g_ - k) / (1 - k);
    const y = (1 - b_ - k) / (1 - k);

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
    };
}

/**
 * Converts a hex color string to an RGB object.
 * @param hex - Hex color string (e.g., "#RRGGBB")
 * @returns An object with r, g, b values (0-255).
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
}
