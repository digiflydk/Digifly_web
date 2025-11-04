import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  tagline?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  textCenter?: boolean;
};

export function SectionHeading({
  tagline,
  title,
  subtitle,
  className,
  textCenter = false,
}: SectionHeadingProps) {
  return (
    <div className={cn('space-y-3', textCenter && 'text-center', className)}>
      {tagline && (
        <p className="font-semibold text-primary uppercase tracking-wider">
          {tagline}
        </p>
      )}
      <h2 className="font-headline text-h2 font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-lg text-muted-foreground max-w-2xl", textCenter && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
