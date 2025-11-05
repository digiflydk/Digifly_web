import { Button } from "@/components/ui/button";
import { HomePage } from "@/lib/types";
import { MediaImage } from "../ui/media-image";
import Image from "next/image";

export default function Hero({ data }: { data: HomePage["hero"] }) {
  return (
    <section className="relative -mt-16 w-full pt-16">
        <div className="absolute inset-0 h-[70vh] min-h-[500px]">
            {data.image?.src && (
                <Image
                  src={data.image.src.startsWith('http') ? data.image.src : `/media/${data.image.src}`}
                  alt={data.image.alt || "Hero"}
                  fill
                  priority
                  className="pointer-events-none object-cover w-full h-[60vh] md:h-[70vh]"
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-purple-900/10 to-transparent" />
        </div>
      <div className="container relative flex h-[70vh] min-h-[500px] items-center py-24 md:py-28">
        <div className="max-w-2xl">
            <h1 className="font-headline text-[clamp(28px,6vw,56px)] leading-[1.2] font-bold tracking-tight text-foreground">
              {data.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg opacity-90">{data.subtitle}</p>
            <div className="mt-8">
                <Button href={data.primaryCta?.href}>
                    {data.primaryCta?.label}
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
