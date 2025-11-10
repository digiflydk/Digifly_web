
import type { SiteSettings, HomePage, CaseDoc, Page, Navigation } from './types';

async function fetchCmsData(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const res = await fetch(`${base}/api/cms/${path}`, {
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    const json = await res.json();
    if (!res.ok || json.ok === false) {
      throw new Error(json.error || `Failed to fetch /api/cms/${path}`);
    }
    return json.data ?? json; // Handle both {ok,data} and direct data responses
  } catch (e: any) {
    console.error(`[cms-client] Failed to fetch data for '${path}':`, e.message);
    throw e; // re-throw to be caught by caller
  }
}

// Read current site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchCmsData('site');
}

// Save site settings
export async function saveSiteSettings(payload: unknown): Promise<SiteSettings> {
  const res = await fetch('/api/cms/site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Failed to save site settings');
  }
  return json.data;
}


// Specific page getters
export async function getHomepage(): Promise<HomePage> {
    const res = await fetchCmsData('pages/home');
    return res as HomePage;
}

export async function updateHomepage(payload: HomePage) {
    const res = await fetch('/api/cms/pages/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save homepage');
    }
    return res.json();
}
