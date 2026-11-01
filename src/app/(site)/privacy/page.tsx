import type { Metadata } from "next";
import Link from "next/link";
import { contactEnabled } from "@/lib/contact";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privatliv" };
export default function PrivacyPage() {
  const enabled = contactEnabled();
  return (
    <article className="wrap legal-page">
      <p className="eyebrow">DINE OPLYSNINGER</p>
      <h1>Privatliv</h1>
      {enabled ? (
        <>
          <p>
            Kontaktformularen behandler dit navn, din mailadresse, din besked og
            de valgfrie oplysninger, du tilføjer, for at modtage og behandle din
            henvendelse.
          </p>
          <div className="privacy-notice">
            {process.env.CONTACT_PRIVACY_NOTICE?.split("\n")
              .filter(Boolean)
              .map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
          </div>
        </>
      ) : (
        <>
          <p>
            Kontaktformularen er ikke åbnet endnu og sender ikke beskeder.
            Oplysninger, du skriver i felterne, bliver ikke gemt af formularen.
          </p>
          <h2>Før kontaktformularen åbner</h2>
          <p>
            Før formularen aktiveres, bliver siden opdateret med den
            dataansvarlige virksomheds oplysninger, kontaktmuligheder og
            information om formål, behandlingsgrundlag, opbevaring, modtagere og
            dine rettigheder.
          </p>
        </>
      )}
      <h2>Besøg på hjemmesiden</h2>
      <p>
        Hjemmesiden indlæser ikke analyseværktøjer eller markedsføringspixels.
        Hostingudbyderen kan behandle tekniske oplysninger om besøget,
        eksempelvis IP-adresse og forespørgsler, for at levere og beskytte
        tjenesten.
      </p>
      <p>
        Læs også om <Link href="/cookies">cookies</Link>.
      </p>
    </article>
  );
}
