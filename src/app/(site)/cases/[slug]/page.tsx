import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { customerCases, siteUrl } from "@/lib/marketing";
import { CaseMark } from "@/components/marketing/case-mark";
import { Arrow } from "@/components/marketing/icons";
export function generateStaticParams() {
  return customerCases.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = customerCases.find((entry) => entry.slug === slug);
  return {
    title: item ? `${item.name} · Anonym kundecase` : "Casen findes ikke",
    description: item?.description,
    alternates: siteUrl() && item ? { canonical: `/cases/${slug}` } : undefined,
  };
}
export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = customerCases.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return (
    <>
      <section className="page-hero wrap customer-case-hero">
        <Link href="/cases" className="back-link">
          ← Vores arbejde
        </Link>
        <p className="eyebrow">
          ANONYM KUNDECASE / {item.category.toUpperCase()}
        </p>
        <h1>
          {item.name}
          <span className="indigo">.</span>
        </h1>
        <p>{item.title}</p>
      </section>
      <section className="section wrap case-details">
        <div>
          <div className="case-detail-mark">
            <CaseMark kind={item.visual} />
            <span>Illustration af opgaven</span>
          </div>
          <h2>Opgaven</h2>
          <div className="text-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div>
          <p>{item.problem}</p>
          <h3>Vores bidrag</h3>
          <p>{item.approach}</p>
          <p className="case-disclosure">
            Kundenavnet er udeladt. Beskrivelsen viser opgavens fokus og omfang.
          </p>
          <Link
            href={`/contact?subject=${encodeURIComponent(item.subject)}`}
            className="button"
          >
            Tal med os om en lignende opgave <Arrow diagonal />
          </Link>
        </div>
      </section>
    </>
  );
}
