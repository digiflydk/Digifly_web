
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Endpoint } from "../endpoints";
import { ENDPOINTS } from "../endpoints";

type Props = {
  // Optional: allow passing a starting selection, but not required
  selectedLabel?: string;
};

type LastResponse = {
  ok: boolean;
  status: number;
  ms: number;
  bodyText: string;
};

export default function EndpointRunner({ selectedLabel }: Props) {
  const [selectedKey, setSelectedKey] = useState<string>(() => selectedLabel ?? ENDPOINTS[0]?.label ?? "");
  const selectedEndpoint: Endpoint = useMemo(
    () => ENDPOINTS.find(e => e.label === selectedKey) ?? ENDPOINTS[0],
    [selectedKey]
  );

  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyJson, setBodyJson] = useState<string>("{}");
  const [lastResponse, setLastResponse] = useState<LastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setParamValues({});
    const hasSample = Object.prototype.hasOwnProperty.call(selectedEndpoint, "sampleBody")
      && (selectedEndpoint as any).sampleBody !== undefined;
    const initialBody = hasSample
      ? JSON.stringify((selectedEndpoint as any).sampleBody, null, 2)
      : "{}";
    setBodyJson(initialBody);
    setLastResponse(null);
  }, [selectedKey, selectedEndpoint]);

  const handleRun = async () => {
    setIsLoading(true);
    try {
      // Build path with param replacement
      let path = selectedEndpoint.path;
      for (const p of selectedEndpoint.params) {
        const val = (paramValues[p] ?? "").trim();
        path = path.replace(`{${p}}`, encodeURIComponent(val));
      }

      const init: RequestInit = { method: selectedEndpoint.method };
      if (selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT") {
        init.headers = { "Content-Type": "application/json" };
        init.body = bodyJson;
      }

      const start = performance.now();
      const res = await fetch(path, init);
      const ms = Math.round(performance.now() - start);
      const text = await res.text();

      setLastResponse({
        ok: res.ok,
        status: res.status,
        ms,
        bodyText: text,
      });
    } catch (err: any) {
      setLastResponse({
        ok: false,
        status: 0,
        ms: 0,
        bodyText: String(err?.message ?? err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  function pretty(text: string) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }

  return (
    <div className="space-y-6">
      {/* Endpoint selector */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Endpoint</label>
        <select
          className="rounded-xl border px-3 py-2"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
        >
          {ENDPOINTS.map((e) => (
            <option key={e.label} value={e.label}>
              {e.method} — {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* Params */}
      {selectedEndpoint.params.length > 0 && (
        <div className="grid gap-2">
          <label className="text-sm font-medium">Params</label>
          <div className="grid md:grid-cols-2 gap-2">
            {selectedEndpoint.params.map((p) => (
              <input
                key={p}
                className="rounded-xl border px-3 py-2"
                placeholder={`${p}`}
                value={paramValues[p] ?? ""}
                onChange={(e) =>
                  setParamValues((prev) => ({ ...prev, [p]: e.target.value }))
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      {(selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT") && (
        <div className="grid gap-2">
          <label className="text-sm font-medium">Body (JSON)</label>
          <textarea
            className="rounded-xl border px-3 py-2 font-mono text-sm min-h-[180px]"
            value={bodyJson}
            onChange={(e) => setBodyJson(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleRun}
        disabled={isLoading}
        className="rounded-2xl bg-black text-white px-4 py-2"
      >
        {isLoading ? "Running…" : "Run"}
      </button>

      {/* Result */}
      {lastResponse && (
        <div className="grid gap-2">
          <div className="text-sm">
            <span className={`font-medium ${lastResponse.ok ? "text-green-600" : "text-red-600"}`}>
              {lastResponse.ok ? "OK" : "ERROR"}
            </span>{" "}
            • {lastResponse.status} • {lastResponse.ms}ms
          </div>
          <pre className="rounded-xl border p-3 overflow-auto text-sm">
            {pretty(lastResponse.bodyText)}
          </pre>
        </div>
      )}
    </div>
  );
}
