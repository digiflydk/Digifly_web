
import Link from "next/link";

const SNAPSHOTS = [
  {
    slug: "cms-homepage",
    label: "CMS — Homepage",
    filename: "cms-homepage.json",
    description: "Homepage document used by the CMS system."
  },
  {
    slug: "cms-navigation",
    label: "CMS — Navigation",
    filename: "cms-navigation.json",
    description: "Navigation used for header and mobile menu."
  },
  {
    slug: "cms-site",
    label: "CMS — Site settings",
    filename: "cms-site.json",
    description: "Global site and SEO settings."
  },
  {
    slug: "cms-footer",
    label: "CMS — Footer",
    filename: "cms-footer.json",
    description: "Footer navigation groups and links."
  }
];

export default function CmsSnapshotsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">CMS JSON snapshots</h1>
      <p className="text-sm text-muted-foreground max-w-xl">
        Download the exported JSON files used for debugging and CMS analysis.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SNAPSHOTS.map((item) => (
          <div key={item.slug} className="border rounded-xl p-4 bg-card shadow-sm">
            <h2 className="text-sm font-medium">{item.label}</h2>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            <p className="text-[11px] mt-2 text-muted-foreground">
              File: <code>{item.filename}</code>
            </p>

            <div className="mt-4">
              <Link
                href={`/api/dev/cms-snapshots/${item.slug}`}
                className="inline-flex items-center border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-accent"
              >
                Download JSON
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
