
import { CMSApiMapHealth } from '@/components/cms/CMSApiMapHealth';
import { metaDefaults } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return await metaDefaults({
      title: 'CMS API Map',
      description: 'Overview of the CMS API structure and health.',
    });
}

export default function ApiMapPage() {
    return (
        <div className="space-y-4">
             <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/api/cms/pages/home?debug=1" target="_blank">View Home JSON (debug)</Link>
                </Button>
            </div>
            <CMSApiMapHealth />
        </div>
    );
}
