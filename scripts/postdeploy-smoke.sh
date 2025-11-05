#!/usr/bin/env bash
set -euo pipefail
export SITE_URL="${SITE_URL:-https://studio--studio-9863436583-e36f9.us-central1.hosted.app}"
npm run qa:install
npm run qa:ci
echo "Smoke test completed for $SITE_URL"
