import Image from "next/image";
import { notFound } from "next/navigation";
import { getCaseBySlug, getCases } from "@/lib/cms";
import { Metadata } from "next";
import { metaDefaults } from "@/lib/seo";

export async function generateStaticParams() {
    const cases = await getCases({ published: true });
    return cases.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const item = await getCaseBySlug(params.slug);
    if (!item || !item.published) return metaDefaults({ title: 'Not Found' });

    return metaDefaults({
      title: item.seo?.title || item.title,
      description: item.seo?.description || item.excerpt,
      image: item.seo?.image || item.coverImage.src
    });
}

export default async function CaseDetailPage({ params }: { params: { slug: string } }) {
  const item = await getCaseBySlug(params.slug);
  if (!item || item.published === false) return notFound();

  return (
    <article className="container mx-auto p-6 prose prose-neutral max-w-3xl">
      <h1>{item.title}</h1>
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border my-4">
        <Image
          src={(item.coverImage?.src && item.coverImage.src !== "" ? item.coverImage.src : "/placeholder/case-cover.webp")}
          alt={item.coverImage?.alt || item.title}
          fill
          className="object-cover"
        />
      </div>
      {item.excerpt ? <p className="lead">{item.excerpt}</p> : null}
      {item.body ? <div dangerouslySetInnerHTML={{ __html: item.body }} /> : null}
    </article>
  );
}
