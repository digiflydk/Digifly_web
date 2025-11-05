# Digifly – Smoke Test

**What it does (non-technical):**
- Opens the live site after deploy
- Checks that hero text and button come from CMS
- Clicks the CTA to ensure navigation works
- Confirms design variables (colors/fonts) are active
- Ensures images are not broken
- Verifies that known scanner URLs are blocked (404/403)
- Saves a homepage screenshot and an HTML report

## Run locally
`​`​`bash
npm run qa:install
SITE_URL="https://<your-env-url>" npm run qa:smoke
`​`​`

CI / Studio
--

Set SITE_URL to the deployed URL.

Run npm run qa:ci after deploy.

Artifacts: qa-report/ (HTML) and qa-artifacts/homepage.png.
