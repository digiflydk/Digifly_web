import type { HomePage, CaseDoc, Page, Navigation } from './types';

async function fetchCms<T>(path: string, options?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/cms/${path}`, options);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  }
  return res.json();
}

export async function getNavigation(): Promise<Navigation> {
  return fetchCms<Navigation>('navigation', { next: { revalidate: 60 } });
}

export async function getHomePage(): Promise<HomePage> {
  return fetchCms<HomePage>('home', { next: { revalidate: 60 } });
}

export async function getCases(): Promise<CaseDoc[]> {
  return fetchCms<CaseDoc[]>('cases?limit=1000', { next: { revalidate: 60 } });
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc | null> {
    try {
        return await fetchCms<CaseDoc>(`case/${slug}`, { next: { revalidate: 300 } });
    } catch {
        return null;
    }
}

export async function getAboutPage(): Promise<Page<{ body: any }>> {
    return fetchCms<Page<{ body: any }>>('about', { next: { revalidate: 60 } });
}

export async function getServicesPage(): Promise<Page<{ services: any[] }>> {
    return fetchCms<Page<{ services: any[] }>>('services', { next: { revalidate: 60 } });
}

export async function getCasesIndexPage(): Promise<Page<{}>> {
    return fetchCms<Page<{}>>('cases-index', { next: { revalidate: 60 } });
}

export async function getContactPage(): Promise<Page<{}>> {
    return fetchCms<Page<{}>>('contact', { next: { revalidate: 60 } });
}
