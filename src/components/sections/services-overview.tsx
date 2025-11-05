import SectionHeading from "@/components/typography/section-heading";
import { HomePage } from "@/lib/types";

export default function ServicesOverview({ items }: { items: HomePage['servicesPreview'] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <SectionHeading>Services</SectionHeading>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((s) => (
          <a key={s.title} href={s.href} className="rounded-2xl border border-[var(--color-platinum)] p-6 hover:shadow-sm transition">
            <h3 className="text-2xl font-semibold text-[var(--color-graphite)]">{s.title}</h3>
            <ul className="mt-3 space-y-2 text-[var(--fs-body)] text-[var(--color-graphite)]/90 list-disc pl-5">
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </a>
        ))}
      </div>
    </section>
  );
}
