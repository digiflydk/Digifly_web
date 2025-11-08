
"use server";

import { getBaseUrl } from './utils/baseUrl';
import { 
    HomepageSchema, 
    SiteSettingsSchema, 
    type SiteSettings,
    type HomePage,
    CaseSchema
} from './schemas';
import type { ZodIssue } from 'zod';
import type { CaseDoc, Navigation } from './types';


type ApiResult<T> = { ok: true, data: T } | { ok: false, error: string, issues?: any[] };


async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResult<T>> {
    const base = getBaseUrl();
    const url = `${base}/api/cms/${path.replace(/^\//, '')}`;
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            ...options,
            headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }
        });
        const json = await res.json();
        if (!res.ok || json.ok === false) {
            throw new Error(json.error || `API fetch failed: ${res.statusText}`);
        }
        return { ok: true, data: json.data };
    } catch(e: any) {
        return { ok: false, error: e.message };
    }
}

// Site Settings
export async function getSiteSettings(): Promise<ApiResult<SiteSettings>> {
    const result = await apiFetch<SiteSettings>('site');
    if (!result.ok) return result;
    const parsed = SiteSettingsSchema.safeParse(result.data);
    if (!parsed.success) {
        return { ok: false, error: 'Validation Error', issues: parsed.error.issues };
    }
    return { ok: true, data: parsed.data };
}

export async function saveSiteSettings(data: SiteSettings): Promise<ApiResult<SiteSettings>> {
    const parsed = SiteSettingsSchema.safeParse(data);
    if (!parsed.success) {
        return { ok: false, error: 'Validation Error', issues: parsed.error.issues };
    }
    return apiFetch<SiteSettings>('site', { method: 'PUT', body: JSON.stringify(parsed.data) });
}

// Homepage
export async function getHomepage(): Promise<ApiResult<HomePage>> {
    const result = await apiFetch<HomePage>('pages/home');
     if (!result.ok) return result;
    const parsed = HomepageSchema.safeParse(result.data);
    if (!parsed.success) {
        return { ok: false, error: 'Validation Error', issues: parsed.error.issues };
    }
    return { ok: true, data: parsed.data };
}

export async function updateHomepage(data: HomePage): Promise<ApiResult<HomePage>> {
    const parsed = HomepageSchema.safeParse(data);
    if (!parsed.success) {
        return { ok: false, error: 'Validation Error', issues: parsed.error.issues };
    }
    return apiFetch<HomePage>('pages/home', { method: 'PUT', body: JSON.stringify(parsed.data) });
}

// Navigation
export async function getNavigation(): Promise<ApiResult<Navigation>> {
    return apiFetch<Navigation>('navigation');
}
export async function updateNavigation(data: Navigation): Promise<ApiResult<{ok: true}>> {
    return apiFetch('navigation', { method: 'PUT', body: JSON.stringify(data) });
}


// Cases
export async function getCases(): Promise<ApiResult<CaseDoc[]>> {
    return apiFetch<CaseDoc[]>('cases');
}
export async function getCaseById(id: string): Promise<ApiResult<CaseDoc>> {
    return apiFetch<CaseDoc>(`cases/${id}`);
}
export async function createCase(data: Partial<CaseDoc>): Promise<ApiResult<CaseDoc>> {
    return apiFetch<CaseDoc>('cases', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateCase(id: string, data: Partial<CaseDoc>): Promise<ApiResult<CaseDoc>> {
    return apiFetch<CaseDoc>(`cases/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteCase(id: string): Promise<ApiResult<{ ok: true }>> {
    return apiFetch(`cases/${id}`, { method: 'DELETE' });
}
