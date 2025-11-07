
import { CMSApiMapHealth } from '@/components/cms/CMSApiMapHealth';
import { metaDefaults } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return metaDefaults({
      title: 'CMS API Map',
      description: 'Overview of the CMS API structure and health.',
    });
}

export default function ApiMapPage() {
    return <CMSApiMapHealth />;
}
