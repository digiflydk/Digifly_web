import { HomePage } from "@/lib/types";
import { SectionHeading } from "../ui/section-heading";

export default function ServicesOverview({ items }: { items: HomePage['servicesPreview'] }) {
  return (
    <section className="container py-16 md:py-24">
      <SectionHeading align="left">Services</SectionHeading>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <a key={s.title} href={s.href} className="rounded-2xl border border-[var(--color-platinum)] p-6 hover:shadow-sm transition min-w-0">
            <h3 className="text-2xl font-semibold text-[var(--color-graphite)] truncate md:whitespace-normal">{s.title}</h3>
            <ul className="mt-3 space-y-2 text-[var(--fs-body)] text-[var(--color-graphite)]/90 list-disc pl-5">
              {s.bullets.map((b) => <li key={b} className="break-words">{b}</li>)}
            </ul>
          </a>
        ))}
      </div>
    </section>
  );
}
