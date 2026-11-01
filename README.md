# Digifly website

Danish B2B website for Digifly, built in the existing Next.js App Router project. The site presents AI, software, system implementation and advisory services through five anonymous customer cases. Testimonial placeholders have been removed for publication; no quotes are invented.

## Development

Use Node 22 and the checked-in npm lockfile. `npm ci --ignore-scripts` installs dependencies. `npm run dev` starts the local development wrapper on port 9002. The coordinator controls preview lifecycle in managed environments.

Run `npm run typecheck`, `npm run lint`, `npm run test:unit` and `npm run build`. Marketing pages build without Firebase credentials. Never run the retained legacy `cms:seed` command as part of a build.

## Release status

Publication of the informational website is authorized. The verified target is Firebase project studio-9863436583-e36f9, backend studio in us-central1, connected to digifly.dk and automatic main rollouts from this repository. apphosting.yaml sets the public canonical, enables indexing and explicitly keeps contact disabled. The coordinator records the actual rollout outcome in the PR.

The contact gateway, real recipient and reviewed business/privacy information remain follow-up requirements before enabling the form. Local development without production variables remains noindex.

Legacy CMS/Admin routes are blocked because their previous write APIs lacked verified authorization. Source is retained for a separate authenticated CMS task. Do not re-enable those routes by deleting the middleware block.

## Documentation

- docs/product-brief.md: scope and responsibilities
- docs/architecture.md: routes, content, API and data handling
- docs/hosting.md: verified and pending hosting details
- docs/deployment.md: checks, release gates and rollback
- docs/testing.md: exact test scope
- docs/backlog.md and docs/releases.md: task/release state

The original Digifly wordmark and D favicon are reused. Inter is self-hosted through @fontsource-variable/inter. No third-party analytics or tracking scripts are loaded.
