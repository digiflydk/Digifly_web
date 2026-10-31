# Digifly website

Danish B2B website for Digifly, built in the existing Next.js App Router project. The site presents AI, software, system implementation and advisory services through five anonymous customer cases. Testimonial cards are explicit preview placeholders, with no invented quotes.

## Development

Use Node 22 and the checked-in npm lockfile. `npm ci --ignore-scripts` installs dependencies. `npm run dev` starts the local development wrapper on port 9002. The coordinator controls preview lifecycle in managed environments.

Run `npm run typecheck`, `npm run lint`, `npm run test:unit` and `npm run build`. Marketing pages build without Firebase credentials. Never run the retained legacy `cms:seed` command as part of a build.

## Release status

This is a feature-branch implementation. Firebase production deployment, contact gateway, confirmed public contact recipient, legal company details and canonical-domain verification remain release gates. The contact form fails closed until all required configuration and a reviewed privacy notice exist. The preview is noindex by default.

Legacy CMS/Admin routes are blocked because their previous write APIs lacked verified authorization. Source is retained for a separate authenticated CMS task. Do not re-enable those routes by deleting the middleware block.

## Documentation

- docs/product-brief.md: scope and responsibilities
- docs/architecture.md: routes, content, API and data handling
- docs/hosting.md: verified and pending hosting details
- docs/deployment.md: checks, release gates and rollback
- docs/testing.md: exact test scope
- docs/backlog.md and docs/releases.md: task/release state

The original Digifly wordmark and D favicon are reused. Inter is self-hosted through @fontsource-variable/inter. No third-party analytics or tracking scripts are loaded.
