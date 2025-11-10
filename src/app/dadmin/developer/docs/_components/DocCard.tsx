"use client";
type Doc = {
  title: string;
  slug: string;
  description: string;
  status: "ok" | "missing" | "draft";
  lastUpdated?: string;
  href?: string; // optional deep link
};

export default function DocCard({ doc }: { doc: Doc }) {
  const badge =
    doc.status === "ok"
      ? "bg-green-600 text-white"
      : doc.status === "draft"
      ? "bg-amber-600 text-white"
      : "bg-red-600 text-white";

  return (
    <div className="rounded-xl border p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium">{doc.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${badge}`}>{doc.status}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Slug: {doc.slug}</span>
        {doc.lastUpdated ? <span>Updated: {doc.lastUpdated}</span> : null}
      </div>
      {doc.href ? (
        <a
          className="mt-3 inline-block text-sm underline underline-offset-4"
          href={doc.href}
        >
          Open
        </a>
      ) : null}
    </div>
  );
}
