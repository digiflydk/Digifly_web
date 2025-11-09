
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import EndpointRunner from "./components/EndpointRunner";
import { ENDPOINTS } from "./endpoints";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await metaDefaults({
    title: 'API Explorer',
    description: 'Run live queries against the CMS API.',
  });
}

export default function ApiExplorerPage() {
    return <EndpointRunner endpoints={ENDPOINTS} />;
}
