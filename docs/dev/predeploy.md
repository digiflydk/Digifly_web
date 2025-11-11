
# Pre-deploy QA Checks

This document explains how to use the manual pre-deploy QA check available in the admin panel.

## Purpose

The pre-deploy check is a fast, automated smoke test suite that runs in a headless browser to catch common issues before they are deployed. It is a **manual gate**, meaning you must run it and verify its output before proceeding with a production deployment.

It is **not** part of the automatic `npm run build` process to keep deployments fast.

## What It Checks

The suite (`tests/smoke/predeploy.spec.ts`) currently verifies:
- The homepage (`/`) loads and returns a `200 OK` status.
- There are no client-side console errors on page load.
- The main `<header>` and `<footer>` elements are visible.
- Core SEO tags (`<title>`, `<meta name="description">`) are present.
- It also runs TypeScript checks and other static guards.

## How to Run

### From the Admin Panel (Recommended)

1.  Navigate to **Developer** > **Playwright Tests** in the admin sidebar (`/dadmin/developer/tests`).
2.  Click the **"Run Pre-deploy QA"** button.
3.  The process will run on the server (simulated in the UI for now).
4.  When complete, a link to the latest HTML report will appear. Click **"View Report"** to open it in a new tab.

### Locally via CLI

1.  Ensure you have installed Playwright browsers:
    ```bash
    npx playwright install
    ```
2.  Run the predeploy script:
    ```bash
    npm run predeploy
    ```
3.  This command will:
    - Run the Playwright test suite tagged `@predeploy`.
    - Generate an HTML report in `playwright-report/`.
    - Copy the report to `public/predeploy/reports/` with a timestamp.
    - Update an index file so the admin panel can find the latest report.

## Reading the Report

- **Green is good**: A fully green report means all checks passed.
- **Red requires action**: If any test fails, expand it to see the error message and assertion failure. The report will often include a screenshot or trace of the failure point.
- **Suggestions**: For common failures (like `<Button href=...>` misuse), the error message will include a specific suggestion. Copy this into your Studio task or ticket.

## Acting on Failures

If a check fails:
1.  **Read the error** in the HTML report.
2.  Create a new Studio task or ticket.
3.  Paste the check name and error details into the ticket.
4.  Assign it for a fix.
5.  **Do not proceed with deployment** until the pre-deploy check passes cleanly.
