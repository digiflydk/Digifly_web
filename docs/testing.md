# Website verification

The new marketing release uses local checks, not a newly started GitHub Actions workflow.

| Check | Command or owner | Scope |
| --- | --- | --- |
| TypeScript | npm run typecheck | Repository TypeScript, including retained legacy files |
| Lint | npm run lint | Next app/components; failure propagates |
| Unit tests | npm run test:unit | No-contact-config fail closed, validation/origin, provider failure/success and blocked CMS/actions |
| Production build | npm run build | Next build without Firestore credentials or writes |
| Preview HTTP | BASE_URL=http://127.0.0.1:4173 npm run test:marketing | All marketing pages, unique IDs, no fake cases, SEO, real 404s, legacy blocks and no fake contact success |
| Browser | Coordinator and QA agent | Mobile/desktop layout, interaction, focus, navigation and reduced motion |

The unit test's delivery gateway is an in-memory fetch stub. No test email or external request is sent. HTTP mutation probes target blocked local routes only; never run the contact test against a live configured provider.

Old QA suites are retained for reference but target the former CMS-based site. Do not report them as passed without running their actual specs. The root Playwright config has a consistent 9002 default and does not create another server. In this managed environment browser verification is performed via the supported browser tool; do not install or run a parallel browser-control path.

Contact receipt, legal launch copy, backend association and public domain verification are separate release gates. A disabled preview form is not successful delivery.

## Review record

The content reviewer approved the Danish preview copy and qualitative own-product descriptions. Source QA found and verified fixes for duplicate section IDs, text contrast, robots configuration, the legacy favicon, disabled contact handling, and the form's POST fallback before hydration. The coordinator reviewed the site through the supported preview browser, including marketing routes, unknown routes, blocked legacy routes, and preview robots behavior.

Final checks are run after the feature commit so the build health endpoint identifies the reviewed source. The exact SHA and command outcomes are recorded in the PR. The standalone HTTP test suite is not claimed as passed when the execution environment cannot reach the preview socket. A development preview is not a production-runtime test.
