import { NavLink } from '@/lib/types';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CtaBanner({ text, button }: { text: string; button: NavLink }) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-2xl bg-primary p-10 md:p-16 shadow-xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary-foreground">
              {text}
            </h2>
            <div className="mt-8">
              <Button asChild variant="secondary" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link href={button.href}>{button.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
