

// Isomorphic (server/client) fetch helpers for the CMS API

import type { CaseDoc, HomePage, Navigation } from './types';

type ApiResponse<T> = { data: T; ok: true } | { error: string; ok: false, issues?: any[] };

async function fetchCmsApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    // Relative URL is fine for client-side, but server needs absolute.
    const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') : '';
    const url = `${baseUrl}/api/cms/${path}`;

    try {
        const res = await fetch(url, { ...options, cache: 'no-store' });
        const json: ApiResponse<T> = await res.json();
        
        if (!res.ok || json.ok === false) {
            const errorDetails = 'error' in json ? json.error : 'Unknown API error';
            throw new Error(String(errorDetails));
        }
        return json.data;
    } catch (e: any) {
        // In RSC, fetch can fail with TypeError on network issues.
        console.error(`[cms-api] fetch failed for "${path}":`, e.message);
        // Throw a consistent error format
        throw new Error(`API request for '${path}' failed: ${e.message}`);
    }
}


export async function getCases(params?: { published?: boolean; limit?: number }): Promise<CaseDoc[]> {
  const qp = new URLSearchParams();
  if (params?.published !== undefined) qp.set('published', String(params.published));
  if (params?.limit) qp.set('limit', String(params.limit));
  return fetchCmsApi<CaseDoc[]>(`cases?${qp.toString()}`);
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    return fetchCmsApi<CaseDoc | null>(`cases/${slug}`);
}

export async function deleteCase(id: string): Promise<{ ok: true }> {
  // This is a client-side action, so relative URL is fine
  const res = await fetch(`/api/cms/cases/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const msg = await res.text().catch(() => `status ${res.status}`);
    throw new Error(`Failed to delete case ${id}: ${msg}`);
  }
  return { ok: true };
}

export async function getHomepage(): Promise<HomePage> {
    return fetchCmsApi<HomePage>('pages/home');
}

export async function updateHomepage(payload: HomePage): Promise<{ ok: true, data: HomePage }> {
    return fetchCmsApi<{ ok: true, data: HomePage }>('pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export async function getNavigation(): Promise<Navigation> {
    return fetchCmsApi<Navigation>('navigation');
}

export async function updateNavigation(payload: Navigation): Promise<{ ok: true }> {
    return fetchCmsApi<{ ok: true }>('navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}
