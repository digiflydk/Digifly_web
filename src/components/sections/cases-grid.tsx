
import { getCases } from '@/lib/cms';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MediaImage } from '@/components/ui/media-image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

function CaseCard({ item }: { item: { slug: string; title: string; image: { src: string; alt?: string }; summary: string; metrics?: { label: string; value: string }[] } }) {
    return (
      <Link href={`/cases/${item.slug}`} className="group rounded-2xl border border-[var(--color-platinum)] p-4 hover:shadow-sm transition block min-w-0">
        <div className="aspect-[4/3] overflow-hidden rounded-xl relative">
          <MediaImage
            src={item.image.src}
            alt={item.image.alt || item.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <h3 className="mt-4 font-headline text-xl font-semibold text-foreground truncate md:whitespace-normal">{item.title}</h3>
        <p className="mt-2 text-muted-foreground text-sm break-words">{item.summary}</p>
        <div className="flex justify-between items-center mt-4">
            <div className='flex gap-2 flex-wrap'>
                {item.metrics?.slice(0, 1).map(metric => (
                    <Badge key={metric.label} variant="secondary">{metric.value} {metric.label}</Badge>
                ))}
            </div>
            <div className="flex items-center text-sm font-semibold text-primary">
                Read Case <ArrowRight className="ml-2 h-4 w-4" />
            </div>
        </div>
      </Link>
    );
  }

type CasesGridProps = {
    ids?: string[],
    title: string,
    subtitle?: string | null,
    showAllLink?: boolean
}

export default async function CasesGrid({ ids, title, subtitle, showAllLink = false }: CasesGridProps) {
  let allCases = await getCases();
  const cases = ids
    ? allCases.filter(c => ids.includes(c.slug))
    : allCases;

  const safeSubtitle = subtitle ?? "";

  return (
    <section className="container py-16 md:py-24">
      <SectionHeading textCenter title={title} subtitle={safeSubtitle} />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
          {cases.map((caseDoc) => (
            <CaseCard
              key={caseDoc.slug}
              item={{
                slug: caseDoc.slug,
                title: caseDoc.title,
                image: caseDoc.cover,
                summary: caseDoc.summary ?? "",
                metrics: caseDoc.metrics,
              }}
            />
          ))}
        </div>
        {showAllLink && (
            <div className="mt-12 text-center">
                <Link href="/cases" className="text-primary font-semibold inline-flex items-center">
                    View all cases <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        )}
    </section>
  );
}
