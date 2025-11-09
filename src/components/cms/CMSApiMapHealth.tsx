

"use client";

type ApiEndpoint = { path: string; methods: string[] };

export default function CMSApiMapHealth({
  items,
}: { items: (string | ApiEndpoint)[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => {
        const path = typeof it === "string" ? it : it.path;
        const methods = typeof it === "string" ? [] : it.methods;
        return (
          <li key={i}>
            <code>{path}</code>
            {methods.length ? <> ({methods.join(", ")})</> : null}
          </li>
        );
      })}
    </ul>
  );
}
