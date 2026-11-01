# Connected production domain

On November 1, 2026, the coordinator verified digifly.dk as Connected to App Hosting backend studio in project studio-9863436583-e36f9, region us-central1. The public canonical is https://digifly.dk. No DNS cutover is needed for this repository rollout, and no DNS records have been changed by this implementation.

Individual DNS records, provider settings, www behavior and billing were not independently inventoried. Preserve MX, SPF, DKIM, DMARC and unrelated subdomains. Verify public HTTPS, canonical behavior, direct routes and true 404s after rollout; do not alter unrelated DNS to publish this code change.
