import { HomePage } from '@/lib/types';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { MediaImage } from '@/components/ui/media-image';

export default function IntroWhyHowWhat({ data }: { data: HomePage['intro'] }) {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <SectionHeading
            tagline={data.tagline}
            title={data.heading}
          />
          <p className="text-muted-foreground text-lg">{data.body}</p>
        </div>
        <div>
          {data.image?.src && (
            <MediaImage
              src={data.image.src}
              alt={data.image.alt}
              hint={data.image.hint}
              width={800}
              height={600}
              className="rounded-2xl object-cover shadow-lg"
            />
          )}
        </div>
      </Container>
    </section>
  );
}
