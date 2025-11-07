// Isomorphic (client-safe) fetch helpers for the CMS API
import type { CaseDoc, HomePage, Navigation, SiteSettings } from './types';
import { HomepageSchema, SiteSettingsSchema, NavigationSchema } from './schemas';

// Get client-side base URL
function getClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

export async function fetchCmsApi<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const base = getClientBaseUrl();
  const isAbsolute = /^https?:\/\//i.test(path);
  const isApiRoute = path.startsWith("/api/");
  const url = isAbsolute
    ? path
    : isApiRoute
    ? `${base}${path}`
    : `${base}/api/cms/${path.replace(/^\/+/, "")}`;
  
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const snippet = await res.text().catch(() => "");
    throw new Error(`[cms-api:client] fetch failed for "${url}": ${res.statusText} ${snippet}`);
  }
  
  const jsonResponse = await res.json();
  return (jsonResponse?.data ?? jsonResponse) as T;
}


// Cases
export const getCases = (params?: { published?: boolean; limit?: number }) => {
    const qp = new URLSearchParams();
    if (params?.published !== undefined) qp.set('published', String(params.published));
    if (params?.limit) qp.set('limit', String(params.limit));
    const queryString = qp.toString();
    return fetchCmsApi<CaseDoc[]>(`cases${queryString ? `?${queryString}` : ''}`);
}

export async function deleteCase(id: string): Promise<{ ok: true }> {
  await fetchCmsApi(`cases/${id}`, { method: 'DELETE' });
  return { ok: true };
}

// Homepage
export const getHomepage = () => fetchCmsApi<HomePage>('pages/home');

export async function updateHomepage(payload: HomePage): Promise<HomePage> {
    const validatedPayload = HomepageSchema.parse(payload);
    return await fetchCmsApi<HomePage>('pages/home', {
        method: 'PUT',
        body: JSON.stringify(validatedPayload),
    });
}

// Site Settings
export const getSiteSettings = () => fetchCmsApi<SiteSettings>('site');

export async function saveSiteSettings(payload: SiteSettings): Promise<SiteSettings> {
    const validatedPayload = SiteSettingsSchema.parse(payload);
    return await fetchCmsApi<SiteSettings>('site', {
        method: 'PUT',
        body: JSON.stringify(validatedPayload),
    });
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
        fetchCmsApi('navigation/main', {
            method: 'PUT',
            body: JSON.stringify({ items: validated.header }),
        }),
        fetchCmsApi('navigation/footer', {
            method: 'PUT',
            body: JSON.stringify({ items: validated.footer.columns.flatMap(c => c.links) }),
        }),
    ]);
    return { ok: true };
}
