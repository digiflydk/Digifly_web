import { buildSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import { CMS_API_MAP } from '@/lib/cms-map';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return await buildSeo({
      title: 'CMS API Map',
      description: 'Overview of the CMS API structure and health.',
    });
}

type ApiEndpoint = {
  method?: string;
  path?: string;
  url?: string;
  description?: string;
};

type Cell = string | string[] | ApiEndpoint | number | boolean | null | undefined;

function formatCell(value: Cell): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(formatCell).join(", ");
  if (typeof value === "object") {
    const method = value.method ?? "";
    const path = value.path ?? value.url ?? "";
    const desc = value.description ? ` — ${value.description}` : "";
    const head = [method, path].filter(Boolean).join(" ");
    return (head + desc).trim();
  }
  return String(value);
}

export default function ApiMapPage() {
    const rows = Object.entries(CMS_API_MAP).flatMap(([groupKey, groupValue]) => {
        const groupRows = [];
        // Add a header for the group
        groupRows.push({ key: `__group__${groupKey}`, isGroupHeader: true, value: groupKey.charAt(0).toUpperCase() + groupKey.slice(1) });
        
        // Add rows for each endpoint in the group
        if ('route' in groupValue) { // It's a single endpoint, not a group
            groupRows.push({ key: groupKey, value: formatCell(groupValue as Cell) });
        } else {
            for (const [endpointKey, endpointValue] of Object.entries(groupValue)) {
                groupRows.push({ key: `${groupKey}.${endpointKey}`, value: formatCell(endpointValue as Cell) });
            }
        }
        return groupRows;
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Key
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Details
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {rows.map(row => {
                        if (row.isGroupHeader) {
                            return (
                                <tr key={row.key} className="bg-slate-100">
                                    <td colSpan={2} className="px-6 py-3 text-sm font-semibold text-slate-900">
                                        {row.value}
                                    </td>
                                </tr>
                            );
                        }
                        return (
                            <tr key={row.key}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-mono">{row.key}</td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-slate-500 font-mono">{row.value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
