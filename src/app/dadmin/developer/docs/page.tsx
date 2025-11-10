
export default function DeveloperDocsPage() {
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-semibold">Developer — Docs</h1>
      <p className="text-sm text-muted-foreground">
        Project documentation index will be rendered here.
      </p>
      {/* Placeholder content until real docs are plugged in */}
      <ul className="mt-4 list-disc pl-6 text-sm">
        <li>Debug JSON download</li>
        <li>Build & deploy notes</li>
        <li>Known issues & fixes</li>
      </ul>
    </div>
  );
}
