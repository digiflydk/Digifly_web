import { getCaseBySlug, listCaseSlugs } from "@/lib/cms-server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { RichText } from "@/components/ui/rich-text";
import { Badge } from "@/components/ui/badge";
import { metaDefaults } from "@/lib/seo";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export const revalidate = 300; // 5 min
export const dynamicParams = true;


export async function generateStaticParams() {
  const slugs = await listCaseSlugs();
  return slugs.map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseDoc = await getCaseBySlug(params.slug);
  if (!caseDoc) {
    return metaDefaults({});
  }
  return metaDefaults({
    title: caseDoc.seo.title,
    description: caseDoc.seo.description,
    image: caseDoc.cover.src
  });
}

export default async function CasePage({ params }: Props) {
  const caseDoc = await getCaseBySlug(params.slug);

  if (!caseDoc) {
    notFound();
  }

  return (
    <article className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title={caseDoc.title}
            subtitle={caseDoc.summary}
            textCenter
            className="mb-8"
          />
        </div>

        <div className="aspect-[16/9] md:aspect-[2/1] max-w-5xl mx-auto my-12 overflow-hidden rounded-2xl shadow-xl">
            <MediaImage
                src={caseDoc.cover.src}
                alt={caseDoc.cover.alt}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
            />
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="md:col-span-2">
                <RichText content={caseDoc.body} />
            </div>
            <aside>
                {caseDoc.metrics && caseDoc.metrics.length > 0 && (
                    <div className="sticky top-24 rounded-xl border-2 p-6 shadow-md bg-background">
                        <h3 className="font-headline text-xl font-semibold mb-4">Key Results</h3>
                        <div className="space-y-4">
                            {caseDoc.metrics.map(metric => (
                                <div key={metric.label}>
                                    <p className="text-3xl font-bold text-primary">{metric.value}</p>
                                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
        </div>
      </Container>
    </article>
  );
}
