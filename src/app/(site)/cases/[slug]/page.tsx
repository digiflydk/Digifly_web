import Image from "next/image";
import { notFound } from "next/navigation";
import { getCaseBySlug, getCases } from "@/lib/cms-server";
import { Metadata } from "next";
import { metaDefaults } from "@/lib/seo";
import { CaseSchema } from "@/lib/schemas";

export async function generateStaticParams() {
    const cases = await getCases({ published: true });
    return cases.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const item = await getCaseBySlug(params.slug);
    if (!item || !item.published) return metaDefaults({ title: 'Not Found' });

    const parsed = CaseSchema.parse(item);

    return metaDefaults({
      title: parsed.seo?.title || parsed.title,
      description: parsed.seo?.description || parsed.excerpt,
      image: parsed.seo?.image || parsed.coverImage.src
    });
}

export default async function CaseDetailPage({ params }: { params: { slug: string } }) {
  const item = await getCaseBySlug(params.slug);
  if (!item || item.published === false) return notFound();

  const parsed = CaseSchema.parse(item);

  return (
    <article className="container mx-auto p-6 prose prose-neutral max-w-3xl">
      <h1>{parsed.title}</h1>
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border my-4">
        <Image
          src={(parsed.coverImage?.src && parsed.coverImage.src !== "" ? parsed.coverImage.src : "/placeholder/case-cover.webp")}
          alt={parsed.coverImage?.alt || parsed.title}
          fill
          className="object-cover"
        />
      </div>
      {parsed.excerpt ? <p className="lead">{parsed.excerpt}</p> : null}
      {parsed.body ? <div dangerouslySetInnerHTML={{ __html: parsed.body }} /> : null}
    </article>
  );
}
