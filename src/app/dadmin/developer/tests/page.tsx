
export default function PlaywrightTestsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Developer — Playwright tests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Playwright test summary will be shown here.
      </p>
      {/* Placeholder panel until the runner/report is wired */}
      <div className="mt-4 rounded-lg border p-4 text-sm">
        <p>Test runner UI coming from existing implementation.</p>
      </div>
    </div>
  );
}
