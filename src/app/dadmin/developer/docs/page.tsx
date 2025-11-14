
import { buildSeo } from "@/lib/seo";
import type { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, FileJson, Beaker, ShieldCheck, History, Settings, Map, Camera } from "lucide-react";
import { DocsList } from "@/components/docs/DocsList";
import LoggingSettings from "../../_components/LoggingSettings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Developer Tools & Docs',
    description: 'Project documentation, tools, and technical files.',
    noIndex: true,
  });
}

const DUMPS = [
  {
    title: "Full CMS Dump",
    description: "A JSON file containing all key CMS documents (homepage, navigation, site settings).",
    href: "/dadmin/developer/cms-dump",
    filename: "digifly-cms-dump.json",
    icon: FileJson,
  },
  {
    title: "CMS API Dump",
    description: "A JSON list of all registered CMS and admin-facing API endpoints.",
    href: "/api/developer/cms-api-dump",
    filename: "cms-api-dump.json",
    icon: FileJson,
  },
  {
    title: "DB Structure Dump",
    description: "A JSON overview of the Firestore collection and subcollection structure.",
    href: "/api/developer/db-structure",
    filename: "db-structure-dump.json",
    icon: FileJson,
  },
  {
    title: "DB Paths Dump",
    description: "A JSON map of all Firestore paths used in the codebase and where they are used.",
    href: "/api/developer/db-paths",
    filename: "db-paths-dump.json",
    icon: FileJson,
  },
];

const TOOLS = [
    {
        title: "Pre-deploy Checks",
        description: "Run automated smoke tests and static analysis to ensure build stability before deployment.",
        href: "/dadmin/developer/predeploy",
        icon: ShieldCheck,
        label: "Run Checks"
    },
    {
        title: "Playwright Tests",
        description: "View Playwright test artifacts and trigger new E2E test runs.",
        href: "/dadmin/developer/tests",
        icon: Beaker,
        label: "View Tests"
    },
    {
        title: "Audit Logs",
        description: "View a stream of recent administrative actions, such as saving content or running tests.",
        href: "/dadmin/developer/audit-logs",
        icon: History,
        label: "View Logs"
    },
    {
        title: "API Map",
        description: "View a structured map of all CMS and developer API endpoints.",
        href: "/dadmin/developer/api-map",
        icon: Map,
        label: "View API Map"
    },
    {
        title: "CMS Snapshots",
        description: "Download individual JSON snapshots of CMS documents for debugging.",
        href: "/dadmin/developer/cms-snapshots",
        icon: Camera,
        label: "View Snapshots"
    },
]

export default function DeveloperDocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Developer — Tools & Reports</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Run checks, view test reports, and download live-generated JSON overviews of the application's structure.
        </p>

         <div className="mt-8 grid gap-4 md:grid-cols-2">
            {TOOLS.map(tool => (
                <div key={tool.href} className="border rounded-xl p-4 flex flex-col justify-between items-start gap-4">
                    <div>
                        <h2 className="font-semibold">{tool.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={tool.href}>
                            <tool.icon className="h-4 w-4 mr-2" />
                            {tool.label}
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
        <div className="mt-8">
            <h2 className="text-lg font-semibold">Data Dumps</h2>
            <p className="mt-1 text-sm text-muted-foreground">Download live data snapshots for debugging.</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
            {DUMPS.map(dump => (
                <div key={dump.href} className="border rounded-xl p-4 flex flex-col justify-between items-start gap-4">
                    <div>
                        <h2 className="font-semibold">{dump.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{dump.description}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={dump.href} download={dump.filename} target="_blank">
                            <dump.icon className="h-4 w-4 mr-2" />
                            Download {dump.filename}
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
      </div>
      
       <div className="mt-6 border-t pt-6">
            <h2 className="font-semibold text-base mb-4">Logging Settings</h2>
            <LoggingSettings />
        </div>

      <div>
        <h1 className="text-xl font-semibold">Developer — Docs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Project documentation stored in the <code>/docs</code> directory. Files are read-only.
        </p>
      </div>
      <DocsList />
    </div>
  );
}
