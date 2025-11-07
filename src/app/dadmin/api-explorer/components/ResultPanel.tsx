
"use client";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, XCircle } from "lucide-react";
import { useState } from "react";

type ResultPanelProps = {
  result: {
    status: number;
    ok: boolean;
    duration: number;
    body: any;
    isJson: boolean;
  } | null;
  isLoading: boolean;
};

export function ResultPanel({ result, isLoading }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 bg-slate-100 rounded-b-lg animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4 bg-slate-100 rounded-b-lg text-slate-500">
        Run a request to see the response here.
      </div>
    );
  }

  const { status, ok, duration, body, isJson } = result;
  const prettyBody = isJson ? JSON.stringify(body, null, 2) : String(body);

  const handleCopy = () => {
    navigator.clipboard.writeText(prettyBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([prettyBody], { type: isJson ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isJson ? 'response.json' : 'response.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-t">
      <div className="flex items-center justify-between p-2 bg-slate-50 border-b">
        <div className="flex items-center gap-4">
          <span className={`text-sm font-bold ${ok ? 'text-green-600' : 'text-red-600'}`}>
            Status: {status}
          </span>
          <span className="text-sm text-slate-500">Duration: {duration.toFixed(2)}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
      {!isJson && (
          <div className="p-2 bg-yellow-50 text-yellow-800 text-xs flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Response is not valid JSON. Displaying as raw text.
          </div>
      )}
      <pre className="p-4 text-xs bg-white overflow-auto max-h-[60vh] rounded-b-lg">
        <code>{prettyBody}</code>
      </pre>
    </div>
  );
}
