
import { z } from 'zod';
import { normalizeImageSrc } from './cms-normalize';

/**
 * A Zod schema for validating image source URLs.
 * - It first normalizes the input using `normalizeImageSrc`.
 * - It allows an empty string.
 * - For non-empty strings, it ensures the URL starts with `https://` or `/`.
 * - It validates that the URL path ends with a supported image extension,
 *   ignoring case and any query strings or hash fragments.
 */
export const ImageUrlSchema = z.string()
  .transform(v => normalizeImageSrc(v))
  .superRefine((v, ctx) => {
    if (!v) return; // empty is allowed

    const hasGoodPrefix = v.startsWith('https://') || v.startsWith('/');
    if (!hasGoodPrefix) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Image must be https:// or root-relative (e.g. /image.png)',
      });
      return;
    }
    
    // Extract pathname without query/hash for extension check
    try {
      const path = v.startsWith('/') ? v.split(/[?#]/)[0] : new URL(v).pathname;
      const lower = path.toLowerCase();
      const allowed = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp'];
      if (!allowed.some(ext => lower.endsWith(ext))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Extension must be one of: .png, .jpg, .jpeg, .svg, .ico, .webp',
        });
      }
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid URL format.',
      });
    }
  });

