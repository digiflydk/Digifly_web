
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCaseBySlug, getCases } from "@/lib/cms";
import { Metadata } from "next";
import { metaDefaults } from "@/lib/seo";
import { CaseSchema } from "@/lib/schemas";

export async function generateStaticParams() {
    const cases = await getCases({ published: true });
    return cases.map(c => ({ slug: c.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const item = await getCaseBySlug(slug);
    if (!item || !item.published) return metaDefaults({ title: 'Not Found' });

    const parsed = CaseSchema.parse(item);

    return metaDefaults({
      title: parsed.seo?.title || parsed.title,
      description: parsed.seo?.description || parsed.excerpt,
      image: parsed.cover?.src
    });
}


export default async function CaseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = await getCaseBySlug(slug);
  if (!item || item.published === false) return notFound();

  const parsed = CaseSchema.parse(item);

  return (
    <article className="container mx-auto p-6 prose prose-neutral max-w-3xl">
      <h1>{parsed.title}</h1>
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border my-4">
        <Image
          src={(parsed.cover?.src && parsed.cover.src !== "" ? parsed.cover.src : "/placeholder/case-cover.webp")}
          alt={parsed.cover?.alt || parsed.title}
          fill
          className="object-cover"
        />
      </div>
      {parsed.excerpt ? <p className="lead">{parsed.excerpt}</p> : null}
      {parsed.content ? <div dangerouslySetInnerHTML={{ __html: parsed.content }} /> : null}
    </article>
  );
}
