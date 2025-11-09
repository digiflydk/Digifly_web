
"use client";

import React, { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Template paths we support in the explorer (unions keep nice IntelliSense)
type TemplatePath =
  | "/api/cms/cases"
  | "/api/cms/site"
  | "/api/cms/navigation/main"
  | "/api/cms/navigation/footer"
  | "/api/cms/pages/{slug}"
  | "/api/cms/cases/{slug}";

export type EndpointDef = {
  name: string;
  method: HttpMethod;
  path: TemplatePath;      // template with {param}
  params: string[];        // e.g. ["slug"]
  requiresBody?: boolean;  // true for POST/PUT bodies
};

type Props = {
  selectedEndpoint: EndpointDef;
  onResult?: (result: { ok: boolean; status: number; ms: number; body: any }) => void;
};

export default function EndpointRunner({ selectedEndpoint, onResult }: Props) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyJson, setBodyJson] = useState<string>("{}");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<{
    ok: boolean;
    status: number;
    ms: number;
    body: any;
  } | null>(null);

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const run = async () => {
    setLoading(true);
    try {
      // Keep template as union, but compute a runtime string for the actual request path
      let resolvedPath: string = selectedEndpoint.path as string;
      for (const param of selectedEndpoint.params) {
        const v = paramValues[param] ?? "";
        resolvedPath = resolvedPath.replace(`{${param}}`, v);
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const init: RequestInit = { method: selectedEndpoint.method, headers };

      if (selectedEndpoint.requiresBody && (selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT")) {
        // try to parse and re-serialize to keep it valid JSON
        const parsedBody = bodyJson?.trim() ? JSON.parse(bodyJson) : {};
        init.body = JSON.stringify(parsedBody);
      }

      const t0 = performance.now();
      const res = await fetch(resolvedPath, init);
      const t1 = performance.now();

      let body: any = null;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        body = await res.json();
      } else {
        body = await res.text();
      }

      const payload = { ok: res.ok, status: res.status, ms: Math.round(t1 - t0), body };
      setLastResponse(payload);
      onResult?.(payload);
    } catch (err: any) {
      const payload = { ok: false, status: 0, ms: 0, body: { error: String(err?.message || err) } };
      setLastResponse(payload);
      onResult?.(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4">
        <div className="mb-3 text-sm text-gray-600">
          <span className="font-medium">{selectedEndpoint.method}</span>{" "}
          <code className="rounded bg-gray-50 px-2 py-1">{selectedEndpoint.path}</code>
        </div>

        {selectedEndpoint.params.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selectedEndpoint.params.map((p) => (
              <label key={p} className="text-sm">
                <span className="block mb-1 font-medium">Param: {p}</span>
                <input
                  className="w-full rounded border px-3 py-2"
                  placeholder={`Value for {${p}}`}
                  value={paramValues[p] ?? ""}
                  onChange={(e) => handleParamChange(p, e.target.value)}
                />
              </label>
            ))}
          </div>
        )}

        {selectedEndpoint.requiresBody && (
          <div className="mt-3">
            <label className="text-sm block mb-1 font-medium">Request body (JSON)</label>
            <textarea
              className="w-full rounded border px-3 py-2 font-mono text-xs leading-5"
              rows={8}
              value={bodyJson}
              onChange={(e) => setBodyJson(e.target.value)}
              placeholder='{"title":"Example"}'
            />
          </div>
        )}

        <div className="mt-4">
          <button
            disabled={loading}
            onClick={run}
            className="rounded-2xl border px-4 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run endpoint"}
          </button>
        </div>
      </div>

      {lastResponse && (
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm text-gray-600">
            <span className="font-medium">Status:</span> {lastResponse.status} •{" "}
            <span className="font-medium">Time:</span> {lastResponse.ms} ms
          </div>
          <pre className="whitespace-pre-wrap break-words rounded bg-gray-50 p-3 text-xs">
            {typeof lastResponse.body === "string"
              ? lastResponse.body
              : JSON.stringify(lastResponse.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
