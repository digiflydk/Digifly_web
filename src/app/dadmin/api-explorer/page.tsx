
import type { Metadata } from "next";
import EndpointRunner from "./components/EndpointRunner";
import { buildSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: "API Explorer",
    description: "Run live queries against the CMS API.",
    noIndex: true
  });
}

export const dynamic = "force-dynamic";

export default function ApiExplorerPage() {
  return <EndpointRunner />;
}
