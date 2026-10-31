# Digifly hjemmeside

## Formål

Digiflys hjemmeside skal skabe relevante henvendelser om softwareudvikling, AI,
automatisering og integrationer. Besøgende skal hurtigt forstå, hvad Digifly kan
hjælpe med, og se egne produkter som konkrete eksempler på arbejdet.

## Den første version

- Dansk hjemmeside med brandlinjen **Flow. Digitalize. Scale.**
- AI centralt i den første skærm, ydelsesbeskrivelser og et tydeligt illustrativt
  eksempel på en arbejdsgang.
- Eksisterende Digifly-logo og indigo brandfarve videreføres i et nyt, lyst layout.
- Ydelser: AI og automatisering, digitale produkter, integrationer og
  udviklingskapacitet.
- Orderfly og Opsfly vises som egne produkter. Ingen opdigtede kundecases,
  udtalelser, effekttal eller teamoplysninger.
- Samarbejdsmodel, vision, kontakt og relevant information om data og cookies.
- Eksisterende relevante adresser bevares eller får bevidste redirects.

## Koordination og ansvar

PM fastlægger forretningsmæssige valg og vurderer den første version. Koordinatoren
samler leverancer, prioriterer fund og ejer releasebeslutningen inden for den
godkendte opgave.

| Rolle | Leverance |
| --- | --- |
| Contentagent | Budskaber, dansk copy, vision og kildebevidste produktbeskrivelser |
| UI/UX-agent | Designretning, responsiv adfærd, interaktion og visuel review |
| Seniorudvikler | Implementering, sikker teknisk grundstruktur og dokumentation |
| QA-agent | Uafhængig kontrol af implementering, fejlscenarier og testbevis |

Arbejdet ligger i `digiflydk/Digifly_web` på
`feature/digifly-ai-website`, ud fra main `8f8e539`. Det er det nyere og mest
komplette af de to eksisterende Digifly-repositories. Branding er genbrugt fra
`digiflydk/Digifly-web-2.0`. Dette valg er ikke en verificering af Firebase-backendens
aktuelle GitHub-kobling.

## Acceptkriterier

- Første skærm forklarer AI, software og forretningsværdi på dansk.
- Navigation, produktvalg, formularvalidering og undersider har reel funktion.
- Ingen vandret overflow ved 320, 390, 768 og 1440 px.
- Tastaturfokus, menuadfærd, læsbar kontrast og reduceret bevægelse håndteres.
- Kontakt viser aldrig levering eller succes, medmindre der er belæg for det.
- Build skriver ikke til databasen. Testfejl returnerer fejlkode.
- Gamle skrive-API'er må ikke være offentligt tilgængelige uden adgangskontrol.
- Uafhængigt review og beståede relevante checks knyttes til den aktuelle version.
- Produktion færdigmeldes først efter verificering af release og kontaktflow.

## Forhold der skal være afklaret før offentlig lancering

1. Aktivt Firebase-projekt, backend, region, repository, branch og domænekobling.
   `studio-3438007779-7a496` er en projektreference fra det andet repository,
   ikke et verificeret deploymål.
2. Offentlig kontaktadresse og den faktiske leveringsintegration.
3. Virksomhedsoplysninger og den foreslåede vision/tekst til endelig lancering.
4. Preview- og produktionsindstillinger, herunder indeksering og canonical.

Hjemmesiden kan udvikles og gennemgås, mens disse forhold afklares. Kode, data og
domæner holdes adskilt fra restaurantens drift. Der oprettes ikke nye GitHub
Actions-workflows som del af denne opgave.
