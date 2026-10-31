import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Cookies" };
export default function CookiesPage() {
  return (
    <article className="wrap legal-page">
      <p className="eyebrow">DIT BESØG</p>
      <h1>Cookies</h1>
      <p>
        Denne version af Digiflys hjemmeside sætter ikke analyse- eller
        markedsføringscookies. Vi indlæser heller ikke Google Analytics, Meta
        Pixel eller andre værktøjer til at følge besøgende.
      </p>
      <h2>Sidens funktioner</h2>
      <p>
        Mobilmenuen og eksemplet på en arbejdsgang med AI fungerer uden cookies.
        Dine valg i eksemplet gemmes ikke, når siden genindlæses.
      </p>
      <h2>Hvis det ændrer sig</h2>
      <p>
        Hvis vi senere tilføjer værktøjer, der kræver samtykke, bliver denne
        side og samtykkevalget opdateret, før værktøjerne aktiveres.
      </p>
      <p>
        Læs mere om <Link href="/privacy">privatliv</Link>.
      </p>
    </article>
  );
}
