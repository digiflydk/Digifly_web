
import { z, ZodError, ZodIssue } from 'zod';

// Reusable validator for image URLs
export const safeImageSrc = z.string().trim().refine(
  (v) => {
    if (v === '') return true;
    try {
      // Use a dummy base for root-relative paths
      const url = new URL(v, v.startsWith('/') ? 'https://dummy.base' : undefined);
      return url.protocol === 'https:' || url.protocol === 'http:' || v.startsWith('/');
    } catch {
      // Allow root-relative paths that might not parse as full URLs
      return v.startsWith('/');
    }
  },
  { message: 'Must be an absolute URL (https://...), a root-relative path (e.g. /favicon.ico), or an empty string.' }
).refine(
    (v) => {
        if (v === '') return true;
        // Use a dummy base URL to handle relative paths correctly
        const url = new URL(v, 'http://dummy.base');
        const pathname = url.pathname;
        return /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(pathname);
    },
    { message: 'Only .png, .jpg, .jpeg, .svg, .ico, or .webp files are allowed.' }
).default('');


// Helper to extract Zod issues from any error type
export function zodErrorToIssues(error: unknown): ZodIssue[] {
  if (error instanceof ZodError) {
    return error.issues;
  }
  return [];
}
