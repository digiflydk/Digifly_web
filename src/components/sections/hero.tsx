
'use client';

import { Button } from '@/components/ui/button';
import { MediaImage } from '../ui/media-image';
import Link from 'next/link';
import { resolveCmsLink } from '@/lib/links';
import type { HeroViewModel } from '@/lib/hero-style-utils';
import { CmsLink, HeroSlide } from '@/lib/types';
import { mapHeroSlideToViewModel } from '@/lib/hero-style-utils';
import { SectionHeading } from '../ui/section-heading';
import { Container } from '../layout/container';


type HeroProps = {
  data?: HeroSlide | null;
};

export default function Hero({ data }: HeroProps) {
  if (!data) {
    return (
      <section
        data-testid="homepage-hero"
        className="relative -mt-[var(--header-height,64px)] w-full pt-[var(--header-height,64px)] bg-slate-100"
        style={{ minHeight: 'var(--hero-desktop-min-h, 70vh)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <Container className="relative flex items-center py-24 md:py-28 h-full">
            <div className="max-w-2xl">
                <SectionHeading title="Hero Content Missing" subtitle="The hero section data is not configured or is empty. Please check the CMS." />
            </div>
        </Container>
      </section>
    );
  }
  
  // DGF-475: The mapping now happens on the client, inside this component.
  const {
    heading,
    body,
    textColor,
    imageUrl,
    imageAlt,
    cta,
    overlayEnabled,
    overlayColor,
    eyebrow,
  } = mapHeroSlideToViewModel(data);
  
  const textStyle = textColor ? { color: textColor } : undefined;
  
  const { href, label, target, rel } = resolveCmsLink(cta);

  return (
    <section
      data-testid="homepage-hero"
      className="relative -mt-[var(--header-height,64px)] w-full pt-[var(--header-height,64px)]"
      style={{ minHeight: 'var(--hero-desktop-min-h, 70vh)' }}
    >
      <div
        data-testid="homepage-hero-slide"
        className="absolute inset-0"
      >
        {imageUrl ? (
          <MediaImage
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            className="pointer-events-none object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>

      {overlayEnabled && overlayColor && (
        <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />
      )}
      
      <div className="container relative flex items-center py-24 md:py-28 h-full">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-wide mb-2 opacity-80" style={textStyle}>
              {eyebrow}
            </p>
          )}
          {heading && (
            <h1 className="heading-left font-headline text-[clamp(28px,6vw,56px)] leading-[1.2] font-bold tracking-tight" style={textStyle}>
              {heading}
            </h1>
          )}
          {body && (
            <div className="prose prose-lg mt-4 max-w-none opacity-90" style={textStyle}>
              <p>{body}</p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {href && label && (
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link data-testid="homepage-hero-cta" href={href} target={target} rel={rel}>{label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
