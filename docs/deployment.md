# Development and release

The user authorized publication of the informational website. Contact remains closed until its separate delivery setup is verified. The coordinator owns Git merge and release through the verified Firebase App Hosting backend; do not start a separate GitHub Actions workflow.

## Local commands

```sh
npm ci --ignore-scripts
npm run typecheck
npm run lint
npm run test:unit
NEXT_PUBLIC_SITE_URL=https://digifly.dk SITE_INDEXABLE=true CONTACT_FORM_ENABLED=false npm run build
```

Build runs next build only. It never runs database seed. cms:seed remains an explicitly invoked legacy maintenance command and must not be run during normal development or deployment. Firebase credentials are not needed for the marketing build.

The preview coordinator owns the server through the Sites preview helper. scripts/dev-server.mjs translates --host, --port and --strictPort to Next flags. DIGIFLY_PREVIEW_PRODUCTION=1 selects next start; otherwise it starts next dev. Do not run dev and build against the same .next directory concurrently.

## Informational launch

1. Current source passes typecheck, lint, build and the relevant contact/middleware checks. Browser review covers mobile/desktop, navigation and the honest closed contact state.
2. Testimonial placeholders are removed. Generated concept photographs and illustrative system views remain labelled; no fake quotes, client names or result metrics are published.
3. Use project studio-9863436583-e36f9, backend studio, region us-central1. Its repository is digiflydk/Digifly_web, branch main, root /. The domain digifly.dk is already Connected, and automatic rollouts from main are enabled.
4. Verify Firebase Console overrides agree with apphosting.yaml: canonical https://digifly.dk, indexing true and CONTACT_FORM_ENABLED=false. Confirm the deployed runtime matches Node 22.
5. Record the approved merge SHA, then follow its single automatic main rollout. Avoid a duplicate manual deployment.
6. Verify the rollout succeeds and check /api/health, HTTPS, actual pages, canonical tags, robots.txt, sitemap.xml, true 404s and blocked legacy routes. Contact must remain closed, with no false success. Live status is recorded by the coordinator in the PR/release record.

## Contact activation later

Confirm the real recipient and public business information. Review CONTACT_PRIVACY_NOTICE and configure the HTTPS gateway and Secret Manager token. The gateway must validate the token, enforce abuse limits, forward/store reliably and define retention. Test end-to-end receipt before enabling CONTACT_FORM_ENABLED. The informational launch does not imply working message delivery.

## Rollback

The existing successful App Hosting build is a-hxwmx1uqi6q8, associated Cloud Build 038956b3-a695-4a9a-aae2-3f8e02749ddd. The console displays November 11, 2025, 14:52:44, Firebase Studio. The coordinator verified this before launch. Restore that rollout if needed and revert the bad main commit so the next rollout does not reintroduce it. No database writes or DNS cutover are included in this change.

## Version sources checked

https://nextjs.org/blog/nextjs-security-update-october-14-2026 identifies 15.5.28 as the patched Maintenance LTS version. https://nextjs.org/support-policy lists Next 15 support through January 31, 2027. Plan an upgrade to Next 16 before that date. https://firebase.google.com/docs/app-hosting/frameworks-tooling describes Node 22+ support. https://firebase.google.com/docs/app-hosting/configure documents BUILD/RUNTIME env availability and Console override precedence.
