

import type { SiteSettings, HomePage, CaseDoc, Page, Navigation } from './types';

async function fetchCmsData(path: string, options?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const res = await fetch(`${base}/api/cms/${path}`, {
      ...options,
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

export async function getNavigation(): Promise<Navigation> {
    const main = await fetchCmsData('navigation/main');
    const footer = await fetchCmsData('navigation/footer');
    return { header: main.header || [], footer: footer.footer || { columns: [] } };
}

export async function updateNavigation(data: Navigation) {
    // This could be a single endpoint, but for simplicity we'll do two calls
    await fetch('/api/cms/navigation/main', { method: 'PUT', body: JSON.stringify({ items: data.header }) });
    await fetch('/api/cms/navigation/footer', { method: 'PUT', body: JSON.stringify({ items: data.footer.columns[0]?.links ?? [] }) });
}
