import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, siteUrl } from "@/lib/marketing";
import { ProductArt } from "@/components/marketing/product-art";
import { Arrow } from "@/components/marketing/icons";
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: product ? `${product.name} · Eget produkt` : "Produktet findes ikke",
    description: product?.description,
    alternates:
      siteUrl() && product ? { canonical: `/cases/${slug}` } : undefined,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return (
    <>
      <section className="page-hero wrap">
        <Link href="/cases" className="back-link">
          ← Alle produkter
        </Link>
        <p className="eyebrow">
          EGET PRODUKT / {product.category.toUpperCase()}
        </p>
        <h1>
          {product.name}
          <span className="indigo">.</span>
        </h1>
        <p>{product.title}</p>
      </section>
      <div className="wrap case-hero-art">
        <ProductArt product={product.slug as "orderfly" | "opsfly"} />
      </div>
      <section className="section wrap case-details">
        <div>
          <p className="eyebrow">UDGANGSPUNKTET</p>
          <h2>
            En hverdag, <br />
            der skal hænge sammen.
          </h2>
        </div>
        <div>
          <p>{product.problem}</p>
          <h3>Det arbejder vi med</h3>
          <p>{product.approach}</p>
          <div className="text-tags">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="case-disclosure">
            {product.name} er Digiflys eget produkt. Illustrationen viser
            produktets fokusområder og er ikke et skærmbillede med kundedata.
          </p>
          <Link href={`/contact?subject=${product.name}`} className="button">
            Tal med os om {product.name} <Arrow diagonal />
          </Link>
        </div>
      </section>
    </>
  );
}
