import { Button } from "@/components/ui/button";
import { HomePage } from "@/lib/types";
import { MediaImage } from "../ui/media-image";
import Link from 'next/link';

export default function Hero({ data }: { data: HomePage["hero"] }) {
  const imageSrc = data.image?.src || '';

  return (
    <section 
      className="relative -mt-16 w-full pt-16"
      style={{ minHeight: 'var(--hero-desktop-min-h, 70vh)' }}
    >
        <div className="absolute inset-0">
            {imageSrc ? (
                <MediaImage
                  src={imageSrc}
                  alt={data.image.alt}
                  fill
                  priority
                  className="pointer-events-none object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
            ) : (
              <div className="w-full h-full bg-slate-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-purple-900/10 to-transparent" />
        </div>
      <div className="container relative flex items-center py-24 md:py-28 h-full">
        <div className="max-w-2xl">
            <h1 className="heading-left font-headline text-[clamp(28px,6vw,56px)] leading-[1.2] font-bold tracking-tight text-foreground">
              {data.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">{data.subtitle}</p>
            <div className="mt-8">
                {data.primaryCta?.href && data.primaryCta?.label && (
                  <Link href={data.primaryCta.href}>
                    <Button>{data.primaryCta.label}</Button>
                  </Link>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}
