
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
