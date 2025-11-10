
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type DocFile = {
  name: string;
  type: 'markdown' | 'json' | 'other';
  url: string;
};

function groupFiles(files: DocFile[]) {
    const groups: Record<string, DocFile[]> = {
        'Core': [],
        'QA & Testing': [],
        'Technical': [],
        'Other': [],
    };

    files.forEach(file => {
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('readme') || lowerName.includes('contract')) {
            groups['Core'].push(file);
        } else if (lowerName.includes('playwright') || lowerName.includes('spec') || lowerName.includes('test') || lowerName.includes('qa')) {
            groups['QA & Testing'].push(file);
        } else if (lowerName.includes('package') || lowerName.includes('config') || lowerName.includes('schema') || lowerName.includes('openapi') || lowerName.includes('env') || lowerName.includes('firestore')) {
            groups['Technical'].push(file);
        } else {
            groups['Other'].push(file);
        }
    });

    // Remove empty groups and sort files within groups
    for (const key in groups) {
      if (groups[key].length === 0) {
        delete groups[key];
      } else {
        groups[key].sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return groups;
}


export function DocsList() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    fetch("/api/docs/list")
      .then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list docs: ${res.status} - ${text}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Expected JSON but received ${contentType}`);
        }
        return res.json();
      })
      .then(data => setFiles(data.files || []))
      .catch((e) => {
          setFiles([]);
          setError(e.message || "An unknown error occurred while fetching docs list.");
      })
      .finally(() => setIsFetching(false));
  }, []);

  const handleDownloadAll = async () => {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/docs/download?file=all-md.zip`);
        if (!res.ok) throw new Error("Failed to create bundle.");
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `digifly-docs-md.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    } catch(e) {
        console.error(e);
        alert("Could not download bundle.");
    } finally {
        setIsLoading(false);
    }
  }

  const groupedFiles = groupFiles(files);

  const renderContent = () => {
    if (isFetching) {
       return (
           <div className="text-center py-12 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="mt-2">Loading documentation index...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Documentation</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (Object.keys(groupedFiles).length === 0) {
        return (
          <div className="text-center py-12 text-slate-500">
            <p>No documentation files found in the <code>/docs</code> directory.</p>
          </div>
        );
    }
    
    return Object.entries(groupedFiles).map(([groupName, files]) => (
        <div key={groupName}>
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">{groupName}</h2>
            <ul className="space-y-1">
            {files.map(f => (
                <li key={f.name} className="flex justify-between items-center py-2 border-b last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded-md">
                <span className="flex items-center gap-2">
                    {f.type === 'markdown' ? <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <FileJson className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                    <span className="font-mono text-sm break-all">{f.name}</span>
                </span>
                 <Button asChild variant="ghost" size="sm">
                    <Link href={f.url} download>
                        <Download className="h-4 w-4 mr-2" /> Download
                    </Link>
                </Button>
                </li>
            ))}
            </ul>
        </div>
       ));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleDownloadAll} disabled={isLoading || isFetching}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isLoading ? 'Bundling...' : 'Download Markdown Bundle (.zip)'}
        </Button>
      </div>

      <div className="space-y-6">
        {renderContent()}
      </div>

      <p className="text-xs text-muted-foreground pt-4">
        Files are read-only from the project repository. Path traversal is prevented via an allow-list.
      </p>
    </div>
  );
}
