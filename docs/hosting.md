# Digifly hosting inventory

| Setting | Verified state |
| --- | --- |
| Selected codebase | digiflydk/Digifly_web |
| Baseline | 8f8e5390a140ae75acd70434df43904e09282fb0 |
| Feature branch | feature/digifly-ai-website |
| Framework | Next.js 15.5.28, React 18, TypeScript |
| Runtime target | Node 22; local checks currently use runtime-provided Node 24.22.1 |
| Firebase project | studio-3438007779-7a496 appears in the older Digifly-web-2.0 .firebaserc only; live association unverified |
| Backend, region, app root, live branch | Must be read from the active Firebase backend before release |
| Public domain | digifly.dk observed by coordinator; final canonical and backend association remain to be confirmed |
| DNS provider, records, certificate, billing | Not verified in this implementation session |
| Last good rollout / rollback image | Must be recorded before deployment |

No Firebase production deployment, DNS mutation or main merge is part of this implementation checkout. No third hosted repository was created. Firebase App Hosting remains the intended production platform.

## Non-secret environment

NEXT_PUBLIC_SITE_URL must be a verified HTTPS canonical origin. SITE_INDEXABLE defaults to false; enable only at approved public launch with a valid origin. RELEASE_SHA can supply the exact source commit in build environments without Git; otherwise it is read from Git at build time and exposed by /api/health.

CONTACT_FORM_ENABLED=true, CONTACT_WEBHOOK_URL, CONTACT_WEBHOOK_TOKEN and CONTACT_PRIVACY_NOTICE are all required to open the contact form. The gateway URL must use HTTPS and implement the documented contract. The token belongs in Secret Manager, never source control. CONTACT_PRIVACY_NOTICE must contain the reviewed real business and processing information before activation. CONTACT_FORM_ENABLED alone cannot open the form.

Firebase console values may override apphosting.yaml. Confirm the deployed configuration and backend runtime before rollout. Existing GitHub credentials do not imply Firebase Console access.
