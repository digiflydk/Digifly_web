import { z } from 'zod';

function normalizeImageSrc(input: unknown): string {
    if (typeof input !== 'string') return '';
    let v = input.trim();
    if (!v) return '';

    // Upgrade http to https
    if (v.startsWith('http://')) {
        v = v.replace(/^http:\/\//, 'https://');
    }

    // Add leading slash to relative paths that are missing it
    if (!v.startsWith('/') && !v.startsWith('http')) {
        v = `/${v}`;
    }

    return v;
}


export const ImageUrlSchema = z.string()
  .transform(v => normalizeImageSrc(v))
  .superRefine((v, ctx) => {
    if (v === '') return; // Allow empty string to pass validation after normalization.

    const isRootRelative = v.startsWith('/');
    const isAbsolute = v.startsWith('https://');

    if (!isRootRelative && !isAbsolute) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Image must be https:// or root-relative (e.g., /image.png).' });
      return;
    }
    
    // Use URL to safely parse path, ignoring query params/hash
    try {
        const url = new URL(v, isRootRelative ? 'https://dummy.base' : undefined);
        const pathname = url.pathname;
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp'];
        
        if (!allowedExtensions.some(ext => pathname.toLowerCase().endsWith(ext))) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid file extension. Allowed: png, jpg, jpeg, svg, ico, webp.' });
        }
    } catch (e) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid URL format.' });
    }
  });
