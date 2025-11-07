
export function normalizeImageSrc(input: unknown): string {
  let v = (typeof input === 'string' ? input : '').trim();
  if (!v) return '';

  // Accept bare filenames (e.g. hero.png) -> root-relative
  if (/^[\w\-./]+\.(png|jpe?g|svg|ico|webp)$/i.test(v) && !/^(https?:)?\/\//i.test(v) && !v.startsWith('/')) {
    v = `/${v}`;
  }

  // Force https if http
  if (v.startsWith('http://')) v = v.replace(/^http:\/\//i, 'https://');

  // Validate prefix only: https:// or root-relative /
  const goodPrefix = v.startsWith('https://') || v.startsWith('/');
  if (!goodPrefix) return '';

  // Extract pathname without query/hash for extension check
  try {
    const path = v.startsWith('/') ? v.split(/[?#]/)[0] : new URL(v).pathname;
    const lower = path.toLowerCase();
    const okExt = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp'].some(ext => lower.endsWith(ext));
    if (!okExt) return '';
  } catch {
    return '';
  }

  return v;
}

// Placeholder for other normalizers if needed
export function normalizeHome(doc: any) {
  return {
    ...doc,
    hero: {
      ...doc?.hero,
      image: { ...(doc?.hero?.image ?? {}), src: normalizeImageSrc(doc?.hero?.image?.src) },
    },
    intro: {
      ...doc?.intro,
      image: { ...(doc?.intro?.image ?? {}), src: normalizeImageSrc(doc?.intro?.image?.src) },
    },
  };
}
