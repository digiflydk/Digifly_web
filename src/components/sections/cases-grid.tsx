import { getCases } from '@/lib/cms';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaImage } from '@/components/ui/media-image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default async function CasesGrid({ ids, title, subtitle, showAllLink = false }: { ids?: string[], title: string, subtitle: string, showAllLink?: boolean }) {
  let allCases = await getCases();
  const cases = ids
    ? allCases.filter(c => ids.includes(c.slug))
    : allCases;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading textCenter title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {cases.map((caseDoc) => (
            <Link key={caseDoc.slug} href={`/cases/${caseDoc.slug}`} className="group">
              <Card className="h-full overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="aspect-[3/2] overflow-hidden">
                    <MediaImage
                      src={caseDoc.cover.src}
                      alt={caseDoc.cover.alt}
                      hint={caseDoc.cover.hint}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="font-headline text-xl font-semibold text-foreground">
                    {caseDoc.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {caseDoc.summary}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-6 pt-0">
                  <div className='flex gap-2 flex-wrap'>
                    {caseDoc.metrics?.slice(0, 1).map(metric => (
                        <Badge key={metric.label} variant="secondary">{metric.value} {metric.label}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    Read Case <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        {showAllLink && (
            <div className="mt-12 text-center">
                <Link href="/cases" className="text-primary font-semibold inline-flex items-center">
                    View all cases <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        )}
      </Container>
    </section>
  );
}
