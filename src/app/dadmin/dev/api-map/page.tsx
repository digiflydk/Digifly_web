

import CMSApiMapHealth from '@/components/cms/CMSApiMapHealth';
import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import { CMS_API_MAP } from '@/lib/cms-map';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return await buildSeo({
      title: 'CMS API Map',
      description: 'Overview of the CMS API structure and health.',
    });
}

type ApiEndpoint = { path: string; methods: string[]; description?: string };

const asPath = (e: string | ApiEndpoint) => (typeof e === "string" ? e : e.path);

function flattenApiMap() {
    const flattened: (string | ApiEndpoint)[] = [];
    for (const key in CMS_API_MAP) {
        const topLevel = CMS_API_MAP[key as keyof typeof CMS_API_MAP];
        if ('route' in topLevel) {
            flattened.push({ path: topLevel.route, methods: Object.keys(topLevel.methods), description: topLevel.usedBy.join(', ') });
        } else {
            for (const subKey in topLevel) {
                const subLevel = topLevel[subKey];
                flattened.push({ path: subLevel.route, methods: Object.keys(subLevel.methods), description: subLevel.usedBy.join(', ') });
            }
        }
    }
    return flattened;
}

export default function ApiMapPage() {
    const apiItems = flattenApiMap();
    return (
        <div className="space-y-4">
            <CMSApiMapHealth items={apiItems.map(asPath)} />
        </div>
    );
}
