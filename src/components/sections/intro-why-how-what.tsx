
import { HomePage } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import { MediaImage } from '@/components/ui/media-image';

export default function IntroWhyHowWhat({ data }: { data: HomePage['intro'] }) {
  if (!data) return null;
  return (
    <section className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <SectionHeading
            tagline={data.tagline}
            title={data.heading}
          />
          <p className="text-muted-foreground text-lg">{data.body}</p>
        </div>
        <div className="overflow-hidden rounded-2xl" style={{ maxHeight: 'var(--intro-image-max-h, 520px)' }}>
          {data.image?.src && (
            <MediaImage
              src={data.image.src}
              alt={data.image.alt}
              hint={data.image.hint}
              width={800}
              height={600}
              className="object-cover shadow-lg w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
