import Link from "next/link";
import { Arrow } from "./icons";
import { HomeScene } from "./home-scenes";
import { InterfacePreview, ResearchVisual } from "./interface-preview";
import { customerCases } from "@/lib/marketing";

const serviceCards = [
  {
    pillar: "Flow.",
    title: "Systemer i sammenhæng",
    text: "Forbind systemer og automatisér arbejdsgange med AI, hvor det giver mening.",
    scene: "connections",
    label:
      "Illustrativ systemvisning af forbundne systemer, AI og arbejdsgange",
    href: "/services#ydelse-flow",
  },
  {
    pillar: "Digitalize.",
    title: "Systemimplementering og udvikling",
    text: "Implementér de rigtige systemer. Udvikl software til jeres behov.",
    scene: "development",
    label: "Illustrativ systemvisning af softwareudvikling og en produktflade",
    href: "/services#ydelse-digitalize",
  },
  {
    pillar: "Scale.",
    title: "Plads til næste skridt",
    text: "Få udviklingskapacitet og rådgivning til næste skridt i forretningen.",
    scene: "roadmap",
    label: "Illustrativ systemvisning af et roadmap for videreudvikling",
    href: "/services#ydelse-scale",
  },
] as const;
const caseVisuals = {
  "warehouse-management": {
    title: "Lagerstyring",
    kind: "photo",
    src: "/images/warehouse.webp",
    label: "Konceptbillede af scanning af varer på et lager",
  },
  omnichannel: {
    title: "Omnichannel",
    kind: "interface",
    scene: "omnichannel",
    label:
      "Illustrativ systemvisning af et fælles overblik over digitale kanaler",
  },
  "monday-implementering": {
    title: "monday.com",
    kind: "interface",
    scene: "board",
    label: "Illustrativ systemvisning af et board med opgaver",
  },
  fondsresearch: {
    title: "Fondsresearch",
    kind: "research",
    label: "Illustration af dokumenter og research",
  },
  "retail-labels-og-pant": {
    title: "Etiketter og pant",
    kind: "photo",
    src: "/images/retail-labels.webp",
    label: "Konceptbillede af emballage og etiketter",
  },
} as const;

export function VisualHome() {
  return (
    <div className="visual-home">
      <section className="vh-hero wrap">
        <div className="vh-hero-copy">
          <p className="eyebrow">AI. SOFTWARE. FORRETNING.</p>
          <h1>
            <span>Flow.</span>
            <span>Digitalize.</span>
            <span className="indigo">Scale.</span>
          </h1>
          <p className="vh-lead">AI og software med forretningen i centrum.</p>
          <p className="vh-intro">
            Vi udvikler software, implementerer systemer og gør AI anvendelig i
            hverdagen.
          </p>
          <div className="vh-actions">
            <Link className="button" href="/contact">
              Tal med os <Arrow diagonal />
            </Link>
            <Link className="text-link" href="#cases">
              Se vores arbejde <Arrow />
            </Link>
          </div>
        </div>
        <div className="vh-hero-picture">
          <img
            className="vh-photo vh-hero-photo"
            src="/images/hero-workshop.webp"
            alt="Konceptbillede af samarbejde om en digital løsning"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <span className="vh-picture-note">Konceptbillede</span>
        </div>
      </section>

      <section
        className="vh-section wrap"
        id="ydelser"
        aria-labelledby="vh-services-heading"
      >
        <div className="vh-heading">
          <div>
            <p className="eyebrow">HVAD VI GØR</p>
            <h2 id="vh-services-heading">Teknologi, der flytter jer.</h2>
          </div>
          <Link className="text-link" href="/services">
            Se alle ydelser <Arrow />
          </Link>
        </div>
        <div className="vh-service-grid">
          {serviceCards.map((item) => (
            <article className="vh-service" key={item.pillar}>
              <Link
                href={item.href}
                className="vh-tile-link"
                aria-label={`${item.pillar} ${item.title}`}
              >
                <div className="vh-service-picture">
                  <InterfacePreview kind={item.scene} label={item.label} />
                </div>
                <div className="vh-service-copy">
                  <h3>
                    {item.pillar}
                    <span>{item.title}</span>
                  </h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="vh-section vh-work"
        id="cases"
        aria-labelledby="vh-cases-heading"
      >
        <div className="wrap">
          <div className="vh-heading">
            <div>
              <p className="eyebrow">VORES ARBEJDE</p>
              <h2 id="vh-cases-heading">
                Forskellige opgaver.
                <br /> Samme nysgerrighed.
              </h2>
              <p className="vh-case-intro">
                Udvalgte opgaver. Kundenavne er udeladt.
              </p>
            </div>
            <Link className="text-link" href="/cases">
              Alle cases <Arrow />
            </Link>
          </div>
          <p className="vh-media-context">
            Konceptbilleder og illustrative systemvisninger
          </p>
          <div className="vh-case-grid">
            {customerCases.map((item) => {
              const visual = caseVisuals[item.slug];
              return (
                <article className="vh-case" key={item.slug}>
                  <Link
                    className="vh-tile-link"
                    href={`/cases/${item.slug}`}
                    aria-label={`Se opgaven: ${visual.title}`}
                  >
                    <div className="vh-case-picture">
                      {visual.kind === "photo" ? (
                        <img
                          className="vh-photo"
                          src={visual.src}
                          alt={visual.label}
                          width="1536"
                          height="1024"
                          loading="lazy"
                        />
                      ) : visual.kind === "interface" ? (
                        <InterfacePreview
                          kind={visual.scene}
                          label={visual.label}
                        />
                      ) : (
                        <ResearchVisual />
                      )}
                    </div>
                    <div className="vh-case-copy">
                      <h3>{visual.title}</h3>
                      <span className="vh-case-arrow" aria-hidden="true">
                        <Arrow diagonal />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="vh-testimonials-note">
            Kundeudtalelser følger.{" "}
            <span>Pladsholder i forhåndsvisningen.</span>
          </p>
        </div>
      </section>

      <section
        className="vh-section wrap vh-ai"
        id="ai"
        aria-labelledby="vh-ai-heading"
      >
        <div className="vh-ai-picture">
          <HomeScene
            kind="flow"
            label="Illustration af en arbejdsgang fra dokument til AI-forslag og menneskelig vurdering"
          />
        </div>
        <div className="vh-ai-copy">
          <p className="eyebrow">AI MED ET FORMÅL</p>
          <h2 id="vh-ai-heading">AI i praksis.</h2>
          <p>
            Fra henvendelse til handling. AI hjælper med forarbejdet, og et
            menneske tager stilling.
          </p>
          <Link className="text-link" href="/services#ai">
            Se et eksempel <Arrow />
          </Link>
          <span className="vh-picture-note">
            Illustration af en mulig arbejdsgang
          </span>
        </div>
      </section>

      <section
        className="wrap vh-process"
        id="samarbejdet"
        aria-labelledby="vh-process-heading"
      >
        <div className="vh-heading">
          <h2 id="vh-process-heading">Fra samtale til virkelighed.</h2>
          <Link className="text-link" href="/about">
            Sådan arbejder vi <Arrow />
          </Link>
        </div>
        <div className="vh-process-grid">
          {[
            ["01", "Forstå", "Afklar mål og behov."],
            ["02", "Byg", "Udvikl, afprøv og justér."],
            ["03", "Tag i brug", "Sæt i drift og udvikl videre."],
          ].map(([number, title, text]) => (
            <div key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap vh-contact">
        <h2>
          Hvad er jeres
          <br /> næste skridt?
        </h2>
        <Link className="button" href="/contact">
          Tal med os <Arrow diagonal />
        </Link>
      </section>
    </div>
  );
}
