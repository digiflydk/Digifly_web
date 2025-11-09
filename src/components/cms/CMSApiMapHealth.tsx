

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


export default function CMSApiMapHealth({ items }: { items: (string | { path: string; methods: string[] })[] }) {
    return (
        <ul>
            {items.map((it, i) => {
                const path = typeof it === "string" ? it : it.path;
                const methods = typeof it === "string" ? [] : it.methods;
                return <li key={i}><code>{path}</code>{methods.length ? <> ({methods.join(", ")})</> : null}</li>;
            })}
        </ul>
    );
}

