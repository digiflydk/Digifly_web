export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[var(--font-headline)] text-[40px] leading-[1.25] text-[var(--color-graphite)]">
      {children}
    </h2>
  );
}
