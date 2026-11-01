# Digifly hosting inventory

The coordinator verified the following in the signed-in Firebase Console on November 1, 2026.

| Setting | Verified state |
| --- | --- |
| Repository | digiflydk/Digifly_web |
| Baseline | 8f8e5390a140ae75acd70434df43904e09282fb0 |
| Feature branch | feature/digifly-ai-website |
| Framework | Next.js 15.5.28, React 18, TypeScript |
| Runtime target | Node 22; local checks use runtime-provided Node 24.22.1 |
| Firebase project | studio-9863436583-e36f9 |
| App Hosting backend | studio |
| Backend region | us-central1 |
| Connected repository / live branch / app root | digiflydk/Digifly_web / main / / |
| Automatic rollouts | Enabled for main |
| Backend environment | prod |
| Console environment overrides | Console reported “No environment variable overrides found” |
| Environment-specific repository overlay | None; apphosting.yaml is the only App Hosting config |
| Public domain | digifly.dk — Connected |
| Public canonical | https://digifly.dk |
| Existing successful rollback build | a-hxwmx1uqi6q8 |
| Associated Cloud Build | 038956b3-a695-4a9a-aae2-3f8e02749ddd |
| Existing rollout timestamp | Console displayed November 11, 2025, 14:52:44; source Firebase Studio |
| DNS provider, individual records, billing | Not independently inventoried; no DNS change is required for this connected-domain rollout |

The older repository's studio-3438007779-7a496 reference is not the verified Digifly production target. Do not deploy to that project based on the old .firebaserc. No third hosted repository was created.

## Version-controlled environment

apphosting.yaml sets NEXT_PUBLIC_SITE_URL=https://digifly.dk, SITE_INDEXABLE=true and CONTACT_FORM_ENABLED=false at both BUILD and RUNTIME. This enables the verified canonical and public indexing while keeping the contact form closed. Local development without these variables continues to default to noindex.

RELEASE_SHA can supply the exact source commit when the build environment lacks Git. Otherwise the commit is read from Git at build time and exposed by /api/health. The coordinator verifies the deployed version after rollout.

Contact activation is a separate follow-up. CONTACT_FORM_ENABLED=true, CONTACT_WEBHOOK_URL, CONTACT_WEBHOOK_TOKEN and CONTACT_PRIVACY_NOTICE are all required to open it. A real recipient, reviewed business/processing notice, HTTPS gateway and end-to-end receipt must be verified first. Keep the token in Secret Manager. No public email or telephone was found on the existing contact page; none is invented by this launch.

Firebase Console values override apphosting.yaml. The coordinator must check for conflicting values before the rollout, including canonical, indexing and the disabled contact flag. The supported env/availability syntax and precedence are documented at https://firebase.google.com/docs/app-hosting/configure.
