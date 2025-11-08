import Link from "next/link";
import Image from "next/image";
import { getCases } from "@/lib/cms";

export default async function CasesIndexPage() {
  const cases = await getCases({ published: true });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Cases</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <Link key={c.id} href={`/cases/${c.slug}`}>
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="relative aspect-[16/9] bg-muted">
                <Image
                  src={(c.coverImage?.src && c.coverImage.src !== "" ? c.coverImage.src : "/placeholder/case-cover.webp")}
                  alt={c.coverImage?.alt || c.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {c.excerpt || "—"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
