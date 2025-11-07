"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import type { HomePage } from "@/lib/types";
import { MediaImage } from "../ui/media-image";
import Link from 'next/link';
import { cn } from '@/lib/utils';

type HeroData = HomePage["hero"];

export default function Hero({ data }: { data: HeroData }) {
    const { images = [], rotate = true, delaySec = 5, title, subtitle, primaryCta } = data;
    const [index, setIndex] = useState(0);

    const validImages = images.filter(img => img && img.src);
    const hasMultipleImages = validImages.length > 1;

    useEffect(() => {
        if (!hasMultipleImages || !rotate) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % validImages.length);
        }, delaySec * 1000);

        return () => clearInterval(interval);
    }, [validImages.length, delaySec, rotate, hasMultipleImages]);

    const currentImage = validImages[index];

    return (
        <section
            className="relative -mt-16 w-full pt-16"
            style={{ minHeight: 'var(--hero-desktop-min-h, 70vh)' }}
        >
            <AnimatePresence>
                <motion.div
                    key={currentImage?.src || 'placeholder'}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {currentImage?.src ? (
                        <MediaImage
                            src={currentImage.src}
                            alt={currentImage.alt}
                            fill
                            priority={images.indexOf(currentImage) === 0}
                            className="pointer-events-none object-cover w-full h-full"
                            sizes="(max-width: 768px) 100vw, 70vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100" />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-purple-900/10 to-transparent" />
            
            <div className="container relative flex items-center py-24 md:py-28 h-full">
                <div className="max-w-2xl">
                    <h1 className="heading-left font-headline text-[clamp(28px,6vw,56px)] leading-[1.2] font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">{subtitle}</p>
                    <div className="mt-8">
                        {primaryCta?.href && primaryCta?.label && (
                            <Link href={primaryCta.href}>
                                <Button>{primaryCta.label}</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {hasMultipleImages && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {validImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-colors",
                                i === index ? "bg-primary" : "bg-primary/30 hover:bg-primary/50"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
