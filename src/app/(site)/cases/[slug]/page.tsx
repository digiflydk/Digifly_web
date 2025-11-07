
import { getCaseBySlug, listCaseSlugs } from "@/lib/cms-server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import RichText from "@/components/ui/rich-text";
import { metaDefaults } from "@/lib/seo";
import { Metadata } from "next";
import { CaseSchema, parseCase } from "@/lib/schemas";
import { safeStr } from "@/lib/safe";
import SafeImage from "@/components/media/SafeImage";
import { z } from "zod";

type CaseDoc = z.infer<typeof CaseSchema>;
type Params = { slug: string };

export const revalidate = 300; // 5 min
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await listCaseSlugs();
  return slugs.map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const raw = await getCaseBySlug(slug);
  if (!raw) {
    return metaDefaults({ title: 'Case Study Not Found' });
  }
  const doc = parseCase(raw);

  return metaDefaults({
    title: safeStr(doc.seo?.title, doc.title),
    description: safeStr(doc.summary, ""),
    image: doc.cover.src
  });
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const raw = await getCaseBySlug(slug);

  if (!raw) {
    notFound();
  }
  const doc = parseCase(raw) as CaseDoc;

  return (
    <article className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title={doc.title}
            subtitle={doc.summary}
            textCenter
            className="mb-8"
          />
        </div>

        {doc.cover.src && (
          <div className="aspect-[16/9] md:aspect-[2/1] max-w-5xl mx-auto my-12 overflow-hidden rounded-2xl shadow-xl">
              <SafeImage
                  src={doc.cover.src}
                  alt={doc.cover.alt}
                  titleFallback={doc.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover"
              />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="md:col-span-2">
                <RichText content={doc.content?.body} />
            </div>
            <aside>
                {doc.metrics && doc.metrics.length > 0 && (
                    <div className="sticky top-24 rounded-xl border-2 p-6 shadow-md bg-background">
                        <h3 className="font-headline text-xl font-semibold mb-4">Key Results</h3>
                        <div className="space-y-4">
                            {doc.metrics.map(metric => (
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
