import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomePage } from '@/lib/types';
import { Container } from '@/components/layout/container';
import { MediaImage } from '@/components/ui/media-image';

export default function Hero({ data }: { data: HomePage['hero'] }) {
  return (
    <section className="relative -mt-16 h-[80vh] min-h-[500px] w-full pt-16">
      {data.image?.src && (
        <MediaImage
          src={data.image.src}
          alt={data.image.alt}
          hint={data.image.hint}
          fill
          priority
          className="pointer-events-none object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />

      <Container className="relative flex h-full items-center">
        <div className="max-w-2xl">
          <h1 className="font-headline text-5xl md:text-h1 font-bold tracking-tight text-foreground">
            {data.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {data.subtitle}
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href={data.primaryCta.href}>{data.primaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
