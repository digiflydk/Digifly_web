
"use client";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function JsonViewer({ data }: { data: any }) {
  return (
    <pre className="bg-slate-900 text-white text-xs p-4 rounded-lg overflow-auto max-h-[70vh]">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

function LogTimestamp({ ts }: { ts: string }) {
    const [formattedDate, setFormattedDate] = useState('');
  
    useEffect(() => {
      setFormattedDate(formatDistanceToNow(new Date(ts), { addSuffix: true }));
    }, [ts]);
  
    return <>{formattedDate}</>;
}

export function AuditLogList({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  if (!logs || logs.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center text-slate-500">
        <p>No audit logs found.</p>
        <p className="text-sm">Perform an administrative action (like saving a page) to generate a log.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <ul className="divide-y">
          {logs.map((log) => (
            <li key={log.id}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelectedLog(log)}
                  className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-mono text-sm">
                        <Badge variant={log.status === 'ok' ? 'default' : 'destructive'} className={log.action.includes('.read') ? 'bg-blue-600' : log.status === 'ok' ? 'bg-green-600' : ''}>
                          {log.status.toUpperCase()}
                        </Badge>
                        <span className="ml-3">{log.action}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                        <LogTimestamp ts={log.ts} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">by {log.actorEmail}</p>
                </button>
              </DialogTrigger>
            </li>
          ))}
        </ul>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && <JsonViewer data={selectedLog} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
