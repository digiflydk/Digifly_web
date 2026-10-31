import Link from "next/link";
import { faqs, products, services, steps } from "@/lib/marketing";
import { Arrow } from "./icons";
import { ProductArt } from "./product-art";
export function ServicesSection() {
  return (
    <section id="ydelser" className="section wrap">
      <div className="section-intro">
        <p className="eyebrow">01 / HVAD VI GØR</p>
        <div>
          <h2>Jeres ambitioner skal ikke vente på jeres systemer.</h2>
          <p>
            Måske bruger I for meget tid på at flytte data manuelt. Måske er
            næste produkt stadig en idé. Vi tager fat i det, der skal bringe jer
            videre.
          </p>
        </div>
      </div>
      <div className="services-list">
        {services.map((item, i) => (
          <article
            className="service-row"
            key={item.id}
            id={`ydelse-${item.id}`}
          >
            <span className="row-number">0{i + 1}</span>
            <h3>{item.title}</h3>
            <div>
              <p>{item.description}</p>
              <div className="text-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
export function ProductsSection() {
  return (
    <section id="produkter" className="section products-section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / DET VI BYGGER</p>
            <h2>
              Vi bygger også <br />
              vores egne produkter.
            </h2>
          </div>
          <p>
            Fra digitale kundeoplevelser til den daglige drift. Et indblik i de
            løsninger, vi arbejder med.
          </p>
        </div>
        <div className="product-stories">
          {products.map((product, i) => (
            <article
              className={`product-story product-${product.slug}`}
              key={product.slug}
            >
              <div className="product-copy">
                <p className="eyebrow">
                  EGET PRODUKT / {product.category.toUpperCase()}
                </p>
                <h3>
                  {product.name}
                  <span>↗</span>
                </h3>
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <Link href={`/cases/${product.slug}`} className="text-link">
                  Læs om {product.name} <Arrow />
                </Link>
              </div>
              <ProductArt product={product.slug as "orderfly" | "opsfly"} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ProcessSection() {
  return (
    <section id="samarbejdet" className="section wrap">
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 / FRA SAMTALE TIL DRIFT</p>
          <h2>
            Tæt på forretningen. <br />
            Hele vejen.
          </h2>
        </div>
        <p>
          I skal kunne se, hvad der bliver bygget, hvorfor det bliver bygget, og
          hvad næste skridt er.
        </p>
      </div>
      <div className="process-grid">
        {steps.map((step, i) => (
          <article key={step.title}>
            <div className="process-number">
              0{i + 1}
              <span />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function PerspectiveSection() {
  return (
    <section className="perspective-section">
      <div className="wrap perspective-grid">
        <p className="eyebrow">VORES PERSPEKTIV</p>
        <div>
          <h2>
            Teknologi skal kunne <br />
            <span>mærkes i hverdagen.</span>
          </h2>
          <p>
            Vi forbinder forretningsforståelse, software og AI. Vores vision er
            at gøre teknologi til et praktisk redskab for vækst. Med løsninger,
            der kan bruges, vedligeholdes og udvikles.
          </p>
          <Link href="/about" className="text-link">
            Mød tankegangen bag Digifly <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
export function FaqSection() {
  return (
    <section className="section wrap faq-layout">
      <div>
        <p className="eyebrow">GODT AT VIDE</p>
        <h2>
          Det begynder <br />
          med en samtale.
        </h2>
      </div>
      <div>
        {faqs.map((faq) => (
          <details key={faq.question} className="faq-item">
            <summary>
              {faq.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="wrap cta-layout">
        <div>
          <p className="eyebrow light">JERES NÆSTE SKRIDT</p>
          <h2>
            Hvad skal kunne <br />
            lade sig gøre hos jer?
          </h2>
          <p>
            Fortæl os om den idé, udfordring eller arbejdsgang, I vil tage
            videre.
          </p>
        </div>
        <Link
          className="circle-cta"
          href="/contact"
          aria-label="Tal med os om jeres næste skridt"
        >
          <Arrow diagonal />
          <span>Tal med os</span>
        </Link>
      </div>
    </section>
  );
}
