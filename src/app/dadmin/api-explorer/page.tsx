
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import EndpointRunner from "./components/EndpointRunner";

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return metaDefaults({
      title: 'API Explorer',
      description: 'Run live queries against the CMS API.',
    });
}

export default function ApiExplorerPage() {
    return <EndpointRunner />;
}
