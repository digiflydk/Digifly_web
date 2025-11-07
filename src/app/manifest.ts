
import type { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/cms-server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSiteSettings();
  const faviconUrl = s.brand.favicon.src;
  return {
    name: s.siteTitle,
    short_name: s.brand.name,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: faviconUrl ? [
      { src: faviconUrl, sizes: 'any', type: 'image/x-icon' },
      { src: faviconUrl, sizes: '192x192', type: 'image/png' },
      { src: faviconUrl, sizes: '512x512', type: 'image/png' },
    ] : [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    ]
  };
}
