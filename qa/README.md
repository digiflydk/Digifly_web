# Digifly – QA & Testing

This directory contains configuration and tests for Playwright, which runs end-to-end smoke tests against a deployed environment.

## Running Tests

### Local Testing

To run tests against your local development server:

1.  Make sure your dev server is running (`npm run dev`). It should be on `http://localhost:9002`.
2.  Run the tests:

```bash
npm run test:pw
```

3.  To view the HTML report after the run:

```bash
npm run test:pw:report
```

### CI Testing (Post-Deploy)

Tests are automatically run after every successful deployment to a Firebase App Hosting environment. The CI script (`test:pw:ci`) is configured to use the `BASE_URL` provided by the environment and will never block the overall build status (`|| true`).

Test reports (HTML, JUnit) and artifacts (screenshots, traces) are uploaded on every run, successful or not.

## Adding Tests

New test files should be added under the `qa/tests/` directory. Use simple, resilient locators. Prefer `getByRole`, `getByText`, or `data-testid` attributes over brittle CSS selectors.
