# Development and release

Use one feature branch and PR for this website task. Run local checks and independent QA. Do not start GitHub Actions for this task. Do not merge or release until backend association, launch content and contact delivery are confirmed.

## Local commands

```sh
npm ci --ignore-scripts
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Build runs next build only. It never runs database seed. cms:seed remains an explicitly invoked legacy maintenance command and must not be run during normal development or deployment. Unknown or missing Firebase credentials are not needed for the marketing build.

The preview coordinator owns the server through the Sites preview helper. scripts/dev-server.mjs translates --host, --port and --strictPort to Next flags. DIGIFLY_PREVIEW_PRODUCTION=1 selects next start; otherwise it starts next dev. Do not run dev and build against the same .next directory concurrently.

## Release gates

1. Current source commit passes typecheck, lint, build, contact/middleware unit tests and preview HTTP checks.
2. Independent browser review covers 320, 390, 768 and 1440px, keyboard, menu, links, AI controls and form states.
3. PM confirms positioning, anonymous case descriptions, offered services, public legal entity, canonical domain and public contact recipient. Replace testimonial placeholders with approved genuine quotes or hide that section before launch.
4. Complete CONTACT_PRIVACY_NOTICE is reviewed, and configured gateway delivery is tested end-to-end to the agreed recipient. Secrets exist only in runtime secret storage. Gateway must validate token, enforce abuse limits, store/forward reliably, and define retention.
5. Firebase project/backend/repository/branch/region/runtime and last known good release are verified. Confirm Node 22 matches engines and supported runtime.
6. Merge reviewed PR, follow the single automatic rollout or explicitly deploy the approved merge SHA.
7. Check /api/health release SHA, actual pages, mail delivery, HTTPS, redirects, canonical and indexing live.

For rollback use the verified prior App Hosting rollout and revert the bad commit on main so the next rollout does not reintroduce it. No database writes are included in this change.

## Version sources checked

https://nextjs.org/blog/nextjs-security-update-october-14-2026 identifies 15.5.28 as the patched Maintenance LTS version. https://nextjs.org/support-policy lists Next 15 support through January 31, 2027. Plan an upgrade to Next 16 before that date. https://firebase.google.com/docs/app-hosting/frameworks-tooling describes Node 22+ support; the exact backend adapter/runtime must still be checked before deployment.
