export const services = [
  {
    id: "ai",
    title: "AI og automatisering",
    description:
      "Find de opgaver, hvor AI og automatisering giver mening. Vi bygger løsninger med tydelige rammer for data og menneskelig kontrol.",
    tags: ["AI-assistenter", "Dokumentflows", "Automatisering"],
    example: "Fra en gentagen opgave til et gennemtænkt workflow.",
  },
  {
    id: "produkter",
    title: "Digitale produkter",
    description:
      "Gør en idé til et produkt, kunder og medarbejdere kan bruge. Fra brugeroplevelse og første version til løbende forbedringer.",
    tags: ["Webapps", "Kundeportaler", "SaaS"],
    example: "Fra det første koncept til et produkt i drift.",
  },
  {
    id: "integrationer",
    title: "Systemer, der taler sammen",
    description:
      "Forbind de værktøjer, I allerede bruger. Vi bygger integrationer, som flytter data og samler arbejdsgange.",
    tags: ["API-integrationer", "Dataflows", "Samlet overblik"],
    example: "Mindre manuel kopiering. Mere sammenhæng.",
  },
  {
    id: "udvikling",
    title: "Udviklingskapacitet",
    description:
      "Få hjælp til en afgrænset leverance eller den fortsatte udvikling af jeres platform. Med tydelige prioriteringer og synlige leverancer.",
    tags: ["Projektleverancer", "Videreudvikling", "Teknisk sparring"],
    example: "Et ekstra perspektiv. Et konkret næste skridt.",
  },
];
export const products = [
  {
    slug: "orderfly",
    name: "Orderfly",
    category: "Bestilling og kunderejse",
    title: "Fra menu til bestilling.",
    description:
      "En platform til restaurantens digitale bestillingsflow med menu, checkout og administration. Vi arbejder med både kundens oplevelse og den daglige håndtering af ordrer.",
    tags: ["Bestillingsflow", "Checkout", "Administration"],
    problem:
      "En digital bestilling skal fungere for både kunden og restauranten. Oplysningerne skal følge ordren hele vejen, og medarbejderen skal kunne handle på dem.",
    approach:
      "Vi arbejder med sammenhængen mellem menu, bestilling, betaling og håndtering af ordren. Kundeoplevelse og administration udvikles som dele af den samme proces.",
  },
  {
    slug: "opsfly",
    name: "Opsfly",
    category: "Drift og administration",
    title: "Overblik over det, der får hverdagen til at fungere.",
    description:
      "Et produkt til operationelle arbejdsgange med fokus på medarbejdere, vagtplanlægning og administration. Daglige opgaver og information samlet i en digital løsning.",
    tags: ["Medarbejdere", "Vagtplanlægning", "Administration"],
    problem:
      "Driften består af mange opgaver, mennesker og informationer. Når de er spredt, bliver det svært at se, hvad der skal ske, og hvem der har ansvaret.",
    approach:
      "Vi arbejder med at samle medarbejderfunktioner, vagtplanlægning og administrative arbejdsgange. Fokus er et brugbart overblik for dem, der står med opgaverne i hverdagen.",
  },
];
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
  "Digifly bygger digitale produkter, forbinder systemer og automatiserer arbejdsgange med AI. Fra første idé til løsning i drift.";
