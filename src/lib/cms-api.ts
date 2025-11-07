

// Isomorphic (server/client) fetch helpers for the CMS API

import type { CaseDoc, HomePage } from './types';

type Json<T> = { data: T } | { ok: true } | { error: string };

export async function getCases(params?: { published?: boolean; limit?: number }): Promise<CaseDoc[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const qp = new URLSearchParams();
  if (params?.published !== undefined) qp.set('published', String(params.published));
  if (params?.limit) qp.set('limit', String(params.limit));
  
  const url = `${baseUrl}/api/cms/cases?${qp.toString()}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch cases: ${res.status} ${res.statusText} ${text}`);
    }
    const json = await res.json() as Json<CaseDoc[]>;
    return ('data' in json && Array.isArray(json.data)) ? json.data : [];
  } catch (e: any) {
    // In RSC, fetch can fail with TypeError on network issues.
    console.error(`[cms-api] getCases fetch failed:`, e.message);
    return []; // Return empty array to prevent render crash
  }
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const url = `${baseUrl}/api/cms/cases/${slug}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json() as Json<CaseDoc>;
        return ('data' in json) ? json.data : null;
    } catch (e: any) {
        console.error(`[cms-api] getCaseBySlug fetch failed for slug "${slug}":`, e.message);
        return null;
    }
}


export async function deleteCase(id: string): Promise<boolean> {
  // This is a client-side action, so relative URL is fine
  const res = await fetch(`/api/cms/cases/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const msg = await res.text().catch(() => `status ${res.status}`);
    throw new Error(`Failed to delete case ${id}: ${msg}`);
  }
  return true;
}

export async function getHomepage(): Promise<HomePage> {
    const res = await fetch('/api/cms/pages/home', { cache: 'no-store' });
    if (!res.ok) throw new Error(`getHomepage failed: ${res.status}`);
    const json = await res.json();
    return json.data;
}

export async function updateHomepage(payload: HomePage) {
    const res = await fetch('/api/cms/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const json = await res.json().catch(()=>null);
        throw new Error(json?.error?.message || 'Save failed');
    }
    return await res.json();
}
