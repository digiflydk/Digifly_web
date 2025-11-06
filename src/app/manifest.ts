
import type { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/cms-server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSiteSettings();
  return {
    name: s.siteTitle || 'Digifly',
    short_name: 'Digifly',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: s.faviconUrl ? [
      { src: s.faviconUrl, sizes: 'any', type: 'image/x-icon' },
      { src: s.faviconUrl, sizes: '192x192', type: 'image/png' },
      { src: s.faviconUrl, sizes: '512x512', type: 'image/png' },
    ] : [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    ]
  };
}
