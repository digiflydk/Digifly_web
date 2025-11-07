
import { z, ZodError, ZodIssue } from 'zod';

// Reusable validator for image URLs
export const safeImageSrc = z.string().trim().refine(
  (v) => {
    if (v === '') return true;
    try {
      const url = new URL(v, v.startsWith('/') ? 'https://dummy.base' : undefined);
      return url.protocol === 'https:' || url.protocol === 'http:' || v.startsWith('/');
    } catch {
      return v.startsWith('/');
    }
  },
  { message: 'Must be an absolute URL (https://...) or a root-relative path (e.g. /image.png).' }
).refine(
  (v) => v === '' || /\.(png|jpg|jpeg|svg|ico)$/i.test(new URL(v, 'https://dummy.base').pathname),
  { message: 'Only .png, .jpg, .jpeg, .svg, or .ico files are allowed.' }
).default('');


// Helper to extract Zod issues from any error type
export function zodErrorToIssues(error: unknown): ZodIssue[] {
  if (error instanceof ZodError) {
    return error.issues;
  }
  return [];
}
