import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({ children, align = "left", className }: Props) {
  return (
    <h2
      className={cn(
        "font-[var(--font-headline)] text-[40px] leading-[1.25] text-[var(--color-graphite)]",
        align === "center" ? "heading-center" : "heading-left",
        className
      )}
    >
      {children}
    </h2>
  );
}
