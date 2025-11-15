
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import type { HomePage, HeroSlide } from "@/lib/types";
import { MediaImage } from "../ui/media-image";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { resolveCmsLink } from '@/lib/links';
import { cmykToRgba } from '@/lib/utils';

type HeroData = HomePage["hero"];

export default function Hero({ data }: { data?: HeroData | null }) {
    const { slides = [], rotationDelaySec = 5 } = data || {};
    const [index, setIndex] = useState(0);
    
    const visibleSlides = slides.filter(slide => slide.visible !== false);
    const hasMultipleImages = visibleSlides.length > 1;

    useEffect(() => {
        if (!hasMultipleImages) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % visibleSlides.length);
        }, Number(rotationDelaySec) * 1000);

        return () => clearInterval(interval);
    }, [visibleSlides.length, rotationDelaySec, hasMultipleImages]);
    
    if (!data || visibleSlides.length === 0) {
        return (
             <section
                data-testid="homepage-hero"
                className="relative -mt-[var(--header-height,64px)] w-full pt-[var(--header-height,64px)] bg-slate-100"
                style={{ minHeight: 'var(--hero-desktop-min-h, 70vh)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="container relative flex items-center py-24 md:py-28 h-full">
                    <div className="max-w-2xl">
                         <h1 className="heading-left font-headline text-[clamp(28px,6vw,56px)] leading-[1.2] font-bold tracking-tight text-foreground">
                           Hero Content Missing
                        </h1>
                        <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">The hero section data is not configured or is empty. Please add at least one visible slide in the CMS.</p>
                    </div>
                </div>
            </section>
        )
    }

    const currentSlide = visibleSlides[index] as HeroSlide;
    if (!currentSlide) return null;

    const { href, label, target, rel } = resolveCmsLink(currentSlide.cta);

    const overlayEnabled = currentSlide.overlay?.enabled ?? true;
    const cmyk = currentSlide.overlay?.cmyk ?? { c: 0, m: 0, y: 0, k: 80 };
    const opacity = (currentSlide.overlay?.opacityPercent ?? 60) / 100;
    const overlayColor = cmykToRgba(cmyk.c, cmyk.m, cmyk.y, cmyk.k, opacity);
    
    // Explicitly check for false, as undefined/null should default to true for legacy data
    const shouldRenderOverlay = currentSlide.overlay?.enabled !== false;

    const textStyle = currentSlide.textColor ? { color: currentSlide.textColor } : {};


    return (
        <section
            data-testid="homepage-hero"
            className="relative -mt-[var(--header-height,64px)] w-full pt-[var(--header-height,64px)]"
            style={{ minHeight: 'var(--hero-desktop-min-h, 70vh)' }}
        >
            <AnimatePresence>
                <motion.div
                    key={currentSlide.image?.src || index}
                    data-testid="homepage-hero-slide"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {currentSlide.image?.src ? (
                        <MediaImage
                            src={currentSlide.image.src}
                            alt={currentSlide.image.alt}
                            fill
                            priority={visibleSlides.indexOf(currentSlide) === 0}
                            className="pointer-events-none object-cover w-full h-full"
                            sizes="(max-width: 768px) 100vw, 70vw"
                        />
                    ) : (
                         <div className="w-full h-full bg-slate-100" />
                    )}
                </motion.div>
            </AnimatePresence>

            {shouldRenderOverlay ? (
                <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: overlayColor }}
                />
            ) : (
                <>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
                </>
            )}
            
            <div className="container relative flex items-center py-24 md:py-28 h-full">
                <div className="max-w-2xl text-white">
                    {currentSlide.eyebrow && (
                        <p className="text-sm font-semibold tracking-wide text-white/80 mb-2" style={textStyle}>
                            {currentSlide.eyebrow}
                        </p>
                    )}
                    {currentSlide.heading && (
                        <h1 className="heading-left font-headline text-[clamp(28px,6vw,56px)] leading-[1.2] font-bold tracking-tight text-white" style={textStyle}>
                            {currentSlide.heading}
                        </h1>
                    )}
                    {currentSlide.body && (
                        <div className="prose prose-lg mt-4 max-w-none text-white/90" style={textStyle}>
                            <p>{currentSlide.body}</p>
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

            {hasMultipleImages && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {visibleSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-colors",
                                i === index ? "bg-white" : "bg-white/30 hover:bg-white/50"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
