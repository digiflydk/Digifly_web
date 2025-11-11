
import type { CmsLink } from "./types";

const PAGE_ID_TO_PATH_MAP: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  contact: '/contact',
  'cases-index': '/cases',
};

export function mapPageIdToPath(pageId: string): string {
    return PAGE_ID_TO_PATH_MAP[pageId] || `/${pageId}`;
}

type ResolvedLink = {
    href?: string;
    label?: string;
    target?: string;
    rel?: string;
    isActive: boolean;
};

// DGF-312: Safe normalization for CmsLink objects
export function normalizeLink(link: Partial<CmsLink> | null | undefined): CmsLink {
    const defaults = { label: 'Learn More', type: 'external', newTab: false, externalUrl: '/' } as const;
    if (!link || typeof link !== 'object') {
        return { ...defaults };
    }

    const type = link.type === 'internal' || link.type === 'external' ? link.type : defaults.type;
    const label = (typeof link.label === 'string' && link.label.trim()) ? link.label.trim() : defaults.label;

    if (type === 'internal') {
        if (typeof link.internalRef === 'string' && link.internalRef.trim()) {
            return { type: 'internal', label, internalRef: link.internalRef, newTab: !!link.newTab };
        }
        // Invalid internal link, fallback to safe external link to homepage
        return { type: 'external', label, externalUrl: '/', newTab: false };
    }
    
    // type is 'external'
    if (typeof link.externalUrl === 'string' && (link.externalUrl.startsWith('/') || link.externalUrl.startsWith('http'))) {
        return { type: 'external', label, externalUrl: link.externalUrl, newTab: !!link.newTab };
    }

    // Invalid external link, fallback to homepage
    return { ...defaults, label };
}

export function resolveCmsLink(link?: CmsLink | null, currentPath?: string): ResolvedLink {
    if (!link || !link.label) {
        return { isActive: false };
    }

    let href: string | undefined = undefined;
    let target: string | undefined = undefined;
    let rel: string | undefined = undefined;

    if (link.type === 'internal' && link.internalRef) {
        href = mapPageIdToPath(link.internalRef);
    } else if (link.type === 'external' && link.externalUrl) {
        href = link.externalUrl;
    }

    if (href && link.newTab) {
        target = '_blank';
        rel = 'noopener noreferrer';
    }
    
    const isActive = !!(currentPath && href && href !== '/' && currentPath.startsWith(href)) || (href === '/' && currentPath === '/');
    
    return { href, label: link.label, target, rel, isActive };
}

    