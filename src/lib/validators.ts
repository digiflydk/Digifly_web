import { z } from 'zod';

export const ImageUrlSchema = z.string().trim().refine(
  (v) => {
    if (v === '') return true; // Allow empty string
    try {
      if (v.startsWith('/')) {
        // For root-relative paths, we can construct a dummy URL to parse it.
        const url = new URL(v, 'https://dummy.base');
        return /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(url.pathname);
      }
      // For absolute URLs, they must be http or https.
      const url = new URL(v);
      return (url.protocol === 'https:' || url.protocol === 'http:') && /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(url.pathname);
    } catch (e) {
      return false;
    }
  },
  {
    message: 'Must be an absolute URL (https://...), a root-relative path (e.g. /image.png), or an empty string. Allowed extensions: .png, .jpg, .jpeg, .svg, .ico, .webp'
  }
).default('');
