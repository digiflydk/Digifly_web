import { Button } from "@/components/ui/button";
import { HomePage } from "@/lib/types";
import { Container } from "../layout/container";
import { MediaImage } from "../ui/media-image";

export default function Hero({ data }: { data: HomePage["hero"] }) {
  return (
    <section className="relative -mt-16 w-full pt-16">
        <div className="absolute inset-0 h-[80vh] min-h-[500px]">
            {data.image?.src && (
                <MediaImage
                src={data.image.src}
                alt={data.image.alt || "Hero"}
                fill
                priority
                className="pointer-events-none object-cover"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-purple-900/10 to-transparent" />
        </div>
      <Container className="relative flex h-[80vh] min-h-[500px] items-center py-24 md:py-28">
        <div className="max-w-2xl">
            <h1 className="font-headline text-4xl md:text-h1 font-bold tracking-tight text-foreground">
            {data.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{data.subtitle}</p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <a href={data.primaryCta?.href}>
                        {data.primaryCta?.label}
                    </a>
                </Button>
            </div>
        </div>
      </Container>
    </section>
  );
}
