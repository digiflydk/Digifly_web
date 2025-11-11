
import type { MetadataRoute } from 'next';
import { readSiteSettings } from '@/lib/dadmin/siteSeoRepo';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await readSiteSettings();
  const title = s?.general.brandName ?? 'Digifly';
  const faviconUrl = s?.general.faviconUrl;
  
  return {
    name: title,
    short_name: title,
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
