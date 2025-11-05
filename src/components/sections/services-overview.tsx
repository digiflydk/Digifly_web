import { HomePage } from '@/lib/types';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ServicesOverview({ items }: { items: HomePage['servicesPreview'] }) {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <Container>
        <SectionHeading
          textCenter
          title="What We Do"
          subtitle="From high-level strategy to hands-on implementation, we build digital solutions that work."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((s) => (
            <Link key={s.title} href={s.href} className="group">
              <Card className="h-full border-2 border-transparent bg-background shadow-md transition-all hover:border-primary hover:shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-headline text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
