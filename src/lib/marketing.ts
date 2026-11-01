export const services = [
  {
    "id": "flow",
    "pillar": "Flow.",
    "title": "Arbejdsgange, integrationer og AI",
    "description": "Få mennesker, data og systemer til at arbejde sammen. Vi forbinder jeres værktøjer og automatiserer gentagne opgaver med AI, hvor det giver mening.",
    "tags": [
      "Arbejdsgange",
      "Integrationer",
      "AI-automatisering"
    ],
    "example": "Skab sammenhæng i den daglige drift."
  },
  {
    "id": "digitalize",
    "pillar": "Digitalize.",
    "title": "Systemimplementering og udvikling",
    "description": "Få systemer, der passer til jeres forretning. Vi implementerer og tilpasser platforme som monday.com og udvikler software, når opgaven kræver en løsning bygget til jer.",
    "tags": [
      "Systemimplementering",
      "Softwareudvikling",
      "Webapps og platforme"
    ],
    "example": "Fra behov og opsætning til en løsning i brug."
  },
  {
    "id": "scale",
    "pillar": "Scale.",
    "title": "Videreudvikling og teknisk kapacitet",
    "description": "Byg videre, når forretningen vokser. Vi hjælper med at prioritere næste skridt, videreudvikle jeres platform og tilføre udviklingskapacitet, så teknologien kan følge med.",
    "tags": [
      "Videreudvikling",
      "Teknisk sparring",
      "Udviklingskapacitet"
    ],
    "example": "Et teknisk grundlag for næste fase."
  }
];
export const customerCases = [
  {
    slug: "warehouse-management",
    name: "Warehouse management system",
    category: "Software og lagerstyring",
    title: "Digital understøttelse af lagerets arbejdsgange.",
    description:
      "Arbejde med et warehouse management system med fokus på virksomhedens lagerprocesser og behov for overblik.",
    problem:
      "Lagerets arbejdsgange skal kunne omsættes til en digital løsning, der passer til den måde, virksomheden arbejder på.",
    approach:
      "Udvikling af et warehouse management system med virksomhedens arbejdsprocesser som udgangspunkt.",
    tags: ["Lagerstyring", "Software", "Arbejdsgange"],
    subject: "Lagerstyring",
    visual: "warehouse",
  },
  {
    slug: "omnichannel",
    name: "Omnichannel-platform",
    category: "Platform og kunderejse",
    title: "Sammenhæng på tværs af kanaler.",
    description:
      "Arbejde med en omnichannel-platform, der forbinder virksomhedens kanaler i en samlet digital løsning.",
    problem:
      "Kunderejsen og virksomhedens processer skal hænge sammen, også når kontakten foregår gennem forskellige kanaler.",
    approach:
      "Udvikling af en omnichannel-platform med fokus på sammenhæng mellem kanaler og arbejdsgange.",
    tags: ["Omnichannel", "Kunderejse", "Platform"],
    subject: "Omnichannel",
    visual: "channels",
  },
  {
    slug: "monday-implementering",
    name: "Implementering af monday.com",
    category: "Systemimplementering",
    title: "Et system, der passer til arbejdet.",
    description:
      "Implementering af monday.com med udgangspunkt i virksomhedens arbejdsprocesser og behov for struktur og overblik.",
    problem:
      "Et nyt værktøj skal afspejle de opgaver og samarbejdsformer, det skal understøtte i hverdagen.",
    approach:
      "Opsætning og tilpasning af monday.com til virksomhedens arbejdsgange.",
    tags: ["monday.com", "Systemimplementering", "Arbejdsprocesser"],
    subject: "monday.com",
    visual: "workflow",
  },
  {
    slug: "fondsresearch",
    name: "Fondsresearch",
    category: "Research og rådgivning",
    title: "Find de muligheder, der passer til projektet.",
    description:
      "Søgning efter relevante fonde og støttemuligheder med udgangspunkt i et konkret projekt og dets behov.",
    problem:
      "Det kræver overblik at finde fonde, hvis formål og kriterier kan være relevante for projektet.",
    approach:
      "Research af relevante fonde og deres fokusområder som grundlag for at vurdere, hvilke muligheder der er værd at arbejde videre med.",
    tags: ["Fondsresearch", "Støttemuligheder", "Beslutningsgrundlag"],
    subject: "Fondsresearch",
    visual: "documents",
  },
  {
    slug: "retail-labels-og-pant",
    name: "Retail-labels og internationale pantsystemer",
    category: "Produkt- og markedsforberedelse",
    title: "Forbered produktet til næste marked.",
    description:
      "Udvikling af retail-labels og undersøgelse af mærkningskrav og pantsystemer på udenlandske markeder.",
    problem:
      "Når et produkt skal ind på et nyt marked, skal emballagens information og de relevante krav til mærkning og pant undersøges.",
    approach:
      "Arbejde med etiketter og research af markedets mærkningskrav og pantsystemer som grundlag for den videre produktforberedelse.",
    tags: ["Retail-labels", "Mærkningskrav", "Pantsystemer"],
    subject: "Retail-labels og markedsresearch",
    visual: "label",
  },
] as const;
export type CaseVisual = (typeof customerCases)[number]["visual"];
export const casesIntro =
  "Fra software og systemimplementering til research og forberedelse af produkter til nye markeder. Her er et udvalg af vores opgaver, præsenteret uden kundenavne.";
export const steps = [
  {
    title: "Forstå opgaven",
    text: "Vi starter med jeres mål, brugere og arbejdsgange. Sammen finder vi det problem, der er værd at løse først.",
  },
  {
    title: "Gør løsningen konkret",
    text: "Vi afklarer omfanget, skitserer brugeroplevelsen og prioriterer første leverance. I kan se, hvad vi bygger, og hvorfor.",
  },
  {
    title: "Byg og afprøv",
    text: "Vi udvikler i overskuelige trin og viser arbejdet undervejs. Feedback, test og teknisk review er en del af forløbet.",
  },
  {
    title: "Sæt i drift og udvikl videre",
    text: "Vi følger løsningen frem til udgivelse. Næste skridt bygger på erfaringerne fra den faktiske brug.",
  },
];
export const faqs = [
  {
    question: "Skal vi vide præcis, hvad vi vil bygge?",
    answer:
      "Nej. I kan komme med en idé, en arbejdsgang, der tager for lang tid, eller et mål, I vil nå. Vi hjælper med at gøre opgaven konkret, før udviklingen begynder.",
  },
  {
    question: "Kan I arbejde videre på vores eksisterende løsning?",
    answer:
      "Ja. Vi starter med at gennemgå den relevante kode, opsætning og dokumentation. Derefter vurderer vi, hvad der kan genbruges, og hvad der skal ændres.",
  },
  {
    question: "Hvordan ved vi, om AI er den rigtige løsning?",
    answer:
      "Vi ser på opgaven, datagrundlaget og kravene til kvalitet. Når det giver mening, starter vi med en afgrænset afprøvning, så næste beslutning bygger på et konkret resultat.",
  },
  {
    question: "Kan vi begynde med en mindre opgave?",
    answer:
      "Ja. En afgrænset integration, en første produktversion eller én arbejdsgang kan være et godt sted at begynde. Omfang og leverance aftales på forhånd.",
  },
];
export function siteUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
export const siteDescription =
  "Digifly implementerer systemer, udvikler software og forbinder arbejdsgange med AI. Flow. Digitalize. Scale. Fra daglig drift til næste vækstfase.";
