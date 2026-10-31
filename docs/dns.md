# Domain cutover

No DNS changes have been made. Confirm the authoritative DNS provider and chosen canonical address. Export current records and record the previous website origin before changes.

Use the Firebase App Hosting domain migration wizard. Prepare the domain and certificate first, then direct web traffic using its exact records. Preserve MX, SPF, DKIM, DMARC and unrelated subdomains. Do not assume that an Orderfly wildcard covers Digifly.

Validate HTTPS on apex and www, one permanent redirect to the canonical host, path and query preservation, direct routes and true 404s. Record the resulting records, certificate status and check timestamp here. Restore saved web records if cutover fails; DNS caches may delay rollback.
