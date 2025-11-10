
export default function PlaywrightPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Playwright — Test Reports</h1>
      <p>
        This page exposes Playwright test artifacts so they’re easy to find from Admin.
      </p>

      <div className="space-y-2">
        <h2 className="text-base font-medium">Quick links</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <a className="text-primary underline" href="/playwright-report/index.html" target="_blank" rel="noreferrer">
              Open latest HTML report (if present)
            </a>
          </li>
          <li>
            <a className="text-primary underline" href="/playwright-report.zip" target="_blank" rel="noreferrer">
              Download zipped report (if present)
            </a>
          </li>
          <li>
            <a className="text-primary underline" href="/test-results.json" target="_blank" rel="noreferrer">
              Download results JSON (if present)
            </a>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Note: Links are safe to click even if files are missing; the server will return 404 for absent artifacts.
        </p>
      </div>
    </div>
  );
}
