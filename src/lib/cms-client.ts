import type { DesignSettings, HomePage, CaseDoc, Page, Navigation } from './types';

async function fetchCms<T>(path: string): Promise<T | null> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/cms/${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(`Error fetching CMS data for ${path}:`, e);
    return null;
  }
}

export async function getDesign(): Promise<DesignSettings | null> {
  return fetchCms<DesignSettings>('design');
}

export async function getHomePage(): Promise<HomePage | null> {
  return fetchCms<HomePage>('home');
}

// Read current site settings
export async function getDesignSettings() {
  const res = await fetch('/api/cms/site', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch site settings');
  const json = await res.json();
  return json.data;
}

// Save site settings
export async function saveDesignSettings(payload: unknown) {
  const res = await fetch('/api/cms/site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save site settings');
  const json = await res.json();
  return json.data;
}
