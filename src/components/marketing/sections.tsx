import Link from "next/link";
import {
  faqs,
  customerCases,
  casesIntro,
  services,
  steps,
} from "@/lib/marketing";
import { Arrow } from "./icons";
import { CaseMark } from "./case-mark";
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
export function CasesSection({
  showHeading = true,
}: { showHeading?: boolean } = {}) {
  return (
    <section
      id="cases"
      className={`section cases-section${showHeading ? "" : " cases-section-index"}`}
    >
      <div className="wrap">
        {showHeading && (
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / VORES ARBEJDE</p>
              <h2>
                Forskellige opgaver.
                <br /> Samme blik for forretningen.
              </h2>
            </div>
            <p>{casesIntro}</p>
          </div>
        )}
        <div className="case-grid">
          {customerCases.map((item, index) => (
            <article
              className={`case-card case-tone-${index % 3}`}
              key={item.slug}
            >
              <div className="case-card-top">
                <span className="case-number">0{index + 1}</span>
                <CaseMark kind={item.visual} />
              </div>
              <p className="eyebrow case-badge">ANONYM KUNDECASE</p>
              <h3>{item.name}</h3>
              <p className="case-card-description">{item.description}</p>
              <Link
                href={`/cases/${item.slug}`}
                className="text-link"
                aria-label={`Læs om opgaven: ${item.name}`}
              >
                Læs om opgaven <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function TestimonialsSection() {
  return (
    <section
      className="section wrap testimonials-section"
      aria-labelledby="testimonials-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">KUNDEUDTALELSER</p>
          <h2 id="testimonials-heading">Kundernes perspektiv</h2>
        </div>
        <p>
          Pladsholdere i denne forhåndsvisning. Citater tilføjes, når de er
          modtaget og godkendt.
        </p>
      </div>
      <div className="testimonial-placeholders">
        {["X", "Y", "Z"].map((label) => (
          <article key={label} className="testimonial-placeholder">
            <p className="eyebrow">PLADSHOLDER</p>
            <h3>Pladsholder {label}</h3>
            <p>Afventer godkendt kundeudtalelse.</p>
          </article>
        ))}
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
