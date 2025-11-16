"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function JsonViewer({ data }: { data: any }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const prettyJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(prettyJson).then(() => {
      setCopied(true);
      toast({ title: "Copied!", description: "Log JSON copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }, () => {
      toast({ title: "Error", description: "Failed to copy.", variant: "destructive" });
    });
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={handleCopy} className="absolute top-2 right-2 z-10">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        <span className="ml-2">{copied ? 'Copied' : 'Copy JSON'}</span>
      </Button>
      <pre className="bg-slate-900 text-white text-xs p-4 rounded-lg overflow-auto max-h-[70vh]">
        <code>{prettyJson}</code>
      </pre>
    </div>
  );
}
