
import type { Metadata } from "next";
import EndpointRunner from "./components/EndpointRunner";
import { metaDefaults } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await metaDefaults({
    title: "API Explorer",
    description: "Run live queries against the CMS API.",
  });
}

export const dynamic = "force-dynamic";

export default function ApiExplorerPage() {
  return <EndpointRunner />;
}
