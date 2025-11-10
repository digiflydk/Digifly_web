# QA & Testing

## How to run
1) Set the test target:
   - Cloud preview/test env: `export E2E_BASE_URL="https://<your-preview-domain>"`
   - Local: `npm run dev` in another terminal, then no env var needed (defaults to http://localhost:3000)

2) Run tests:
   - Headless CI mode: `npm run test:e2e:ci`
   - Local dev: `npm run test:e2e`
   - View HTML report: `npm run test:e2e:report` (report in `qa/report`)

## What is covered
- Page titles & meta descriptions (Home, About, Services, Contact)
- Canonical link correctness
- robots.txt contains either `Allow: /` or `Disallow: /`
- sitemap.xml returns 200 and lists absolute URLs
- OG image fallback present when page-level OG is missing
- Single H1 per page

## Notes
- If CMS seeding/toggles are available in Studio, wire them into `tests/fixtures/cms.ts`.
- This task does *not* deploy. It targets the existing test/preview environment.
