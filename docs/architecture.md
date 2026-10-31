# Digifly website architecture

The marketing site uses the existing Digifly_web repository and Next.js App Router. Danish content lives in src/lib/marketing.ts and reusable presentation components in src/components/marketing. It renders without Firebase credentials or database access. The existing logo and favicon were retained from Digifly-web-2.0; no new repository was created.

## Routes and content

| Route | Purpose | Source |
| --- | --- | --- |
| / | Positioning, services, products, AI workflow, process, FAQ | marketing components and src/lib/marketing.ts |
| /services | Four service areas and AI approach | services array |
| /cases | Own products, not external customer testimonials | products array |
| /cases/orderfly and /cases/opsfly | Qualitative product stories | products array |
| /about | Vision and working method | page and process component |
| /contact | Validated contact flow, closed in preview | contact form and contactSchema |
| /privacy and /cookies | Actual preview handling; launch-specific notice required | static pages and reviewed notice configuration |
| /api/contact | Configured HTTPS gateway delivery | contact API |
| /api/health | Runtime and build commit identification | health API |
| /robots.txt and /sitemap.xml | Indexing disabled by default | metadata routes |

## Data and validation

Marketing content is source-controlled, typed data. There is no schema-to-CMS mapping for the new pages. Old CMS files remain in source only. The middleware blocks all legacy admin, CMS, debug, docs and Firebase health routes, including encoded variants. All non-reading requests except POST /api/contact are rejected, so legacy Server Actions cannot be invoked through alternate public paths. React client interactions use in-memory state only.

The contact schema validates name (2–100), email (maximum 254), company (maximum 150), subject (maximum 100), message (10–5000) and an empty honeypot. No personal data is logged or saved locally. The delivery gateway is responsible for durable receipt, forwarding to the confirmed recipient, retention and distributed abuse controls. Success means the gateway accepted the request, not proof of inbox delivery. End-to-end delivery is a launch gate.

No restaurant databases, credentials, orders, payments or printer resources are used. Analytics and third-party font loading were removed from the marketing layout. Source backups are Git commits; no new database backup process is required for this site.

## Restoring CMS later

Do not remove the middleware block as a shortcut. A separate reviewed change must introduce verified server-side sessions, authorization for every operation, protected Server Actions, CSRF controls, secure cookie policy, audit records and least-privilege Firebase identity. Test unauthenticated and unauthorized requests before enabling any route. Existing Firestore security rules cannot protect Admin SDK calls.
