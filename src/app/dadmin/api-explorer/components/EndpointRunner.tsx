
"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultPanel } from "./ResultPanel";
import type { Endpoint } from "../endpoints";

type Props = {
  endpoints: readonly Endpoint[];
};

export default function EndpointRunner({ endpoints }: Props) {
  const [selectedKey, setSelectedKey] = useState(`${endpoints[0].method} ${endpoints[0].path}`);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyJson, setBodyJson] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const selectedEndpoint = endpoints.find(e => `${e.method} ${e.path}` === selectedKey) || endpoints[0];

  useEffect(() => {
    setParamValues({});
    setBodyJson(selectedEndpoint.sampleBody ? JSON.stringify(selectedEndpoint.sampleBody, null, 2) : "{}");
    setLastResponse(null);
  }, [selectedKey, selectedEndpoint]);

  const run = async () => {
    setLoading(true);
    try {
      let resolvedPath: string = selectedEndpoint.path;
      for (const param of selectedEndpoint.params) {
        const v = paramValues[param] ?? "";
        resolvedPath = resolvedPath.replace(`{${param}}`, encodeURIComponent(v));
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const init: RequestInit = { method: selectedEndpoint.method, headers };

      if ((selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT")) {
        const parsedBody = bodyJson?.trim() ? JSON.parse(bodyJson) : {};
        init.body = JSON.stringify(parsedBody);
      }
      
      const t0 = performance.now();
      const res = await fetch(resolvedPath, init);
      const t1 = performance.now();

      let body: any = null;
      let isJson = false;
      const ct = res.headers.get("content-type") || "";
      
      if (ct.includes("application/json")) {
        body = await res.json();
        isJson = true;
      } else {
        body = await res.text();
      }

      const payload = { ok: res.ok, status: res.status, duration: t1 - t0, body, isJson };
      setLastResponse(payload);
    } catch (err: any) {
      const payload = { ok: false, status: 0, duration: 0, body: { error: String(err?.message || err) }, isJson: true };
      setLastResponse(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger>
              <SelectValue placeholder="Select an endpoint..." />
            </SelectTrigger>
            <SelectContent>
              {endpoints.map((ep) => {
                const key = `${ep.method} ${ep.path}`;
                return (
                  <SelectItem key={key} value={key}>
                    <span className="font-semibold mr-2">{ep.method}</span>
                    <span className="font-mono text-sm">{ep.path}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 space-y-4">
          {selectedEndpoint.params.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedEndpoint.params.map((p) => (
                <label key={p} className="text-sm">
                  <span className="block mb-1 font-medium text-slate-700">Param: {p}</span>
                  <input
                    className="w-full rounded border px-3 py-2"
                    placeholder={`Value for {${p}}`}
                    value={paramValues[p] ?? ""}
                    onChange={(e) => setParamValues(prev => ({...prev, [p]: e.target.value}))}
                  />
                </label>
              ))}
            </div>
          )}

          {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') && (
            <div>
              <label className="text-sm block mb-1 font-medium text-slate-700">Request body (JSON)</label>
              <textarea
                className="w-full rounded border px-3 py-2 font-mono text-xs leading-5 bg-slate-50"
                rows={8}
                value={bodyJson}
                onChange={(e) => setBodyJson(e.target.value)}
                placeholder='{"title":"Example"}'
              />
            </div>
          )}

          <div>
            <button
              disabled={loading}
              onClick={run}
              className="rounded-lg border bg-slate-100 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-200 disabled:opacity-50"
            >
              {loading ? "Running..." : "Run Endpoint"}
            </button>
          </div>
        </div>
        
        <ResultPanel result={lastResponse} isLoading={loading} />
      </div>
    </div>
  );
}
