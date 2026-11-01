# Digifly hjemmeside

## Formål

Digiflys hjemmeside skal skabe relevante henvendelser om softwareudvikling, AI,
automatisering og integrationer. Besøgende skal hurtigt forstå, hvad Digifly kan
hjælpe med, og se anonyme kundecases som konkrete eksempler på arbejdet.

## Den første version

- Dansk hjemmeside med brandlinjen **Flow. Digitalize. Scale.**
- AI centralt i den første skærm, ydelsesbeskrivelser og et tydeligt illustrativt
  eksempel på en arbejdsgang.
- Eksisterende Digifly-logo og indigo brandfarve videreføres i et nyt, lyst layout.
- Ydelser: AI og automatisering, digitale produkter, systemimplementering og
  integrationer, udviklingskapacitet samt rådgivning og markedsforberedelse.
- Fem anonyme kundecases: warehouse management system, omnichannel-platform,
  implementering af monday.com, fondsresearch samt retail-labels og undersøgelse
  af mærkningskrav og pantsystemer på udenlandske markeder.
- Ingen kundenavne, opfundne resultater, certificeringer eller konkrete
  regelpåstande. Fondsresearch beskriver søgning efter muligheder, ikke
  ansøgningsarbejde eller bevillinger.
- Udtalelsespladsholdere er fjernet før offentliggørelse. Fremtidige
  kundeudtalelser kræver reelle, godkendte citater.
- Samarbejdsmodel, vision, kontakt og relevant information om data og cookies.
- De nye cases har hver sin underside. Tidligere egne produktadresser er ikke
  lanceret og returnerer 404.

## Visuelt princip for forsiden

Forsiden er en kort, billedbåret indgang. Konceptfotos, illustrative systemvisninger og én AI-illustration viser
arbejdet fra forskellige vinkler. Tekstmængden er reduceret til
korte teasere; tre ydelseskort, tre samarbejdstrin og en tydelig kontaktvej
bevares. Scenerne er illustrationer uden kundedata, tal eller resultatpåstande.
FAQ, udførlige ydelser, proces, vision og caseforklaringer findes på undersiderne.
Der vises ingen udtalelsespladsholdere ved offentliggørelse.

## Koordination og ansvar

PM fastlægger forretningsmæssige valg og vurderer den første version. Koordinatoren
samler leverancer, prioriterer fund og ejer releasebeslutningen inden for den
godkendte opgave.

| Rolle | Leverance |
| --- | --- |
| Contentagent | Budskaber, dansk copy, vision og kildebevidste casebeskrivelser |
| UI/UX-agent | Designretning, responsiv adfærd, interaktion og visuel review |
| Seniorudvikler | Implementering, sikker teknisk grundstruktur og dokumentation |
| QA-agent | Uafhængig kontrol af implementering, fejlscenarier og testbevis |

Arbejdet ligger i `digiflydk/Digifly_web` på
`feature/digifly-ai-website`, ud fra main `8f8e539`. Det er det nyere og mest
komplette af de to eksisterende Digifly-repositories. Branding er genbrugt fra
`digiflydk/Digifly-web-2.0`. Koordinatoren har siden verificeret den faktiske
GitHub-kobling i Firebase: projekt `studio-9863436583-e36f9`, backend `studio`,
region `us-central1`, branch `main`, rod `/` og tilsluttet `digifly.dk`.

## Acceptkriterier

- Første skærm forklarer AI, software og forretningsværdi på dansk.
- Navigation, casevalg, formularvalidering og undersider har reel funktion.
- Ingen vandret overflow ved 320, 390, 768 og 1440 px.
- Tastaturfokus, menuadfærd, læsbar kontrast og reduceret bevægelse håndteres.
- Kontakt viser aldrig levering eller succes, medmindre der er belæg for det.
- Build skriver ikke til databasen. Testfejl returnerer fejlkode.
- Gamle skrive-API'er må ikke være offentligt tilgængelige uden adgangskontrol.
- Uafhængigt review og beståede relevante checks knyttes til den aktuelle version.
- Produktion færdigmeldes efter verificering af rollout og offentlige sider.
  Kontaktformularen forbliver tydeligt lukket, indtil faktisk levering er afprøvet.

## Offentliggørelse og opfølgning

Brugeren har godkendt offentliggørelse af informationssiden. Firebase-kobling,
domæne, automatiske main-rollouts og tidligere fungerende rollout er verificeret.
Canonical er `https://digifly.dk`, og produktion indekseres. Koordinatoren ejer
den endelige Git-release og kontrol af den offentliggjorte version.

Kontaktformularen er fortsat lukket. En reel modtager, leveringsintegration og
gennemgåede virksomheds-/privatlivsoplysninger skal på plads, før den aktiveres.
Ingen kontaktoplysninger eller kundeudtalelser opfindes. Kode, data og domæner
holdes adskilt fra restaurantens drift. Der oprettes ikke nye GitHub Actions-workflows.

## Positioning refinement
Core services follow the tagline: Flow (workflows, integration, AI automation), Digitalize (system implementation and bespoke development), Scale (continued development and technical capacity). Fund and label research remain supplementary anonymous cases, not primary service pillars. Homepage, services, about and footer use this positioning.
