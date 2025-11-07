
"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { CMS_API_MAP } from "@/lib/cms-map";
import type { CMSMap } from "@/lib/cms-map";

type HealthStatus = Record<string, { ok: boolean; reason?: string }>;

type FlatEntry = {
    key: string;
    route: string;
    method: string;
    fsPath: string;
    schema: string;
    usedBy: string;
    health?: { ok: boolean; reason?: string };
}

function flattenMap(map: CMSMap, health: HealthStatus): FlatEntry[] {
    const entries: FlatEntry[] = [];
    
    Object.entries(map).forEach(([topKey, topValue]) => {
        if ('route' in topValue) { // e.g., site, page
            Object.entries(topValue.methods).forEach(([method, methodValue]) => {
                const key = methodValue.healthKey || topKey;
                entries.push({
                    key,
                    route: topValue.route,
                    method: method,
                    fsPath: methodValue.path,
                    schema: methodValue.schema,
                    usedBy: topValue.usedBy.join(', '),
                    health: health[key],
                });
            });
        } else { // e.g., navigation, cases
            Object.entries(topValue).forEach(([subKey, subValue]) => {
                Object.entries(subValue.methods).forEach(([method, methodValue]) => {
                    const key = methodValue.healthKey || `${topKey}.${subKey}`;
                    entries.push({
                        key,
                        route: subValue.route,
                        method: method,
                        fsPath: methodValue.path,
                        schema: methodValue.schema,
                        usedBy: subValue.usedBy.join(', '),
                        health: health[key],
                    });
                });
            });
        }
    });
    return entries;
}


export function CMSApiMapHealth() {
  const [data, setData] = useState<{ map: CMSMap; health: HealthStatus } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/debug/cms-map?health=1')
      .then(res => {
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Failed to Load API Map</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (!data) {
    return <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
    </div>;
  }
  
  const flatEntries = flattenMap(data.map, data.health);

  return (
    <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead className="w-[80px]">Method</TableHead>
              <TableHead>Firestore Path</TableHead>
              <TableHead>Used By</TableHead>
              <TableHead className="w-[100px] text-right">Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatEntries.map((entry, i) => (
                <TableRow key={i}>
                    <TableCell className="font-mono">{entry.route}</TableCell>
                    <TableCell><Badge variant="outline">{entry.method}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{entry.fsPath}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{entry.usedBy}</TableCell>
                    <TableCell className="text-right">
                        {entry.health ? (
                            <Badge variant={entry.health.ok ? 'secondary' : 'destructive'}>
                                {entry.health.ok ? 'OK' : 'Error'}
                            </Badge>
                        ) : <span className="text-xs text-muted-foreground">N/A</span>}
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
