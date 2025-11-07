// Isomorphic (server/client) fetch helpers for the CMS API

import type { CaseDoc, HomePage, Navigation, SiteSettings } from './types';
import { HomepageSchema, SiteSettingsSchema, NavigationSchema } from './schemas';

const isServer = typeof window === 'undefined';

async function fetchCmsApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const base = isServer ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') : '';
    const urlPath = path.startsWith('/') ? path : `/api/cms/${path}`;
    const url = `${base}${urlPath}`;
    
    try {
        const res = await fetch(url, { ...options, cache: 'no-store' });
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        
        if (!res.ok || json.ok === false) {
            const errorDetails = json?.error?.message || json?.error || `Request failed with status ${res.status}`;
            throw new Error(String(errorDetails));
        }
        return json.data;
    } catch (e: any) {
        console.error(`[cms-api] fetch failed for "${url}":`, e.message);
        throw new Error(`API request for '${path}' failed: ${e.message}`);
    }
}

// Cases
export async function getCases(params?: { published?: boolean; limit?: number }): Promise<CaseDoc[]> {
  const qp = new URLSearchParams();
  if (params?.published !== undefined) qp.set('published', String(params.published));
  if (params?.limit) qp.set('limit', String(params.limit));
  const queryString = qp.toString();
  return fetchCmsApi<CaseDoc[]>(`cases${queryString ? `?${queryString}` : ''}`);
}

export async function deleteCase(id: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/cms/cases/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const msg = await res.text().catch(() => `status ${res.status}`);
    throw new Error(`Failed to delete case ${id}: ${msg}`);
  }
  return { ok: true };
}

// Homepage
export async function getHomepage(): Promise<HomePage> {
    return fetchCmsApi<HomePage>('pages/home');
}

export async function updateHomepage(payload: HomePage): Promise<HomePage> {
    const validatedPayload = HomepageSchema.parse(payload);
    const response = await fetchCmsApi<HomePage>('pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedPayload),
    });
    return response;
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
    return fetchCmsApi<SiteSettings>('site');
}

export async function saveSiteSettings(payload: SiteSettings): Promise<SiteSettings> {
    const validatedPayload = SiteSettingsSchema.parse(payload);
    const response = await fetchCmsApi<SiteSettings>('site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedPayload),
    });
    return response;
}


// Navigation
export async function getNavigation(): Promise<Navigation> {
    const [main, footer] = await Promise.all([
        fetchCmsApi<Navigation['header']>('navigation/main'),
        fetchCmsApi<Navigation['footer']['columns'][0]['links']>('navigation/footer'),
    ]);
    return {
        header: main,
        footer: { columns: [{ title: 'Links', links: footer }] }
    };
}

export async function updateNavigation(payload: Navigation): Promise<{ok: true}> {
    const validated = NavigationSchema.parse(payload);
    await Promise.all([
        fetch('/api/cms/navigation/main', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: validated.header }),
        }),
        fetch('/api/cms/navigation/footer', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: validated.footer.columns.flatMap(c => c.links) }),
        }),
    ]);
    return { ok: true };
}
