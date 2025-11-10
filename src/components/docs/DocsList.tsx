"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText } from "lucide-react";

type DocFile = {
  name: string;
  type: 'markdown' | 'json';
  url: string;
};

function groupFiles(files: DocFile[]) {
    const groups: Record<string, DocFile[]> = {
        'Core': [],
        'Technical': [],
        'QA & Testing': [],
        'Other': [],
    };

    files.forEach(file => {
        if (file.name.match(/readme|contract/i)) {
            groups['Core'].push(file);
        } else if (file.name.match(/playwright|spec|test|qa/i)) {
            groups['QA & Testing'].push(file);
        } else if (file.name.match(/package|config|setup|schema|openapi|env/i)) {
            groups['Technical'].push(file);
        } else {
            groups['Other'].push(file);
        }
    });

    // Remove empty groups
    for (const key in groups) {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    }

    return groups;
}


export function DocsList() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/docs/list")
      .then(res => res.json())
      .then(data => setFiles(data.files || []));
  }, []);

  const handleDownloadAll = async () => {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/docs/download?file=all-md`);
        if (!res.ok) throw new Error("Failed to create bundle.");
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `digifly-docs-md.zip`;
        a.click();
        URL.revokeObjectURL(a.href);
    } catch(e) {
        console.error(e);
        alert("Could not download bundle.");
    } finally {
        setIsLoading(false);
    }
  }

  const groupedFiles = groupFiles(files);


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleDownloadAll} disabled={isLoading}>
            {isLoading ? 'Bundling...' : <><Download className="h-4 w-4 mr-2" /> Download Markdown Bundle (.zip)</>}
        </Button>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedFiles).length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No documentation files found.</p>
          </div>
        )}
        {Object.entries(groupedFiles).map(([groupName, files]) => {
            if (files.length === 0) return null;
            return (
                <div key={groupName}>
                    <h2 className="text-lg font-semibold mb-3 border-b pb-2">{groupName}</h2>
                    <ul className="space-y-2 mt-4">
                    {files.map(f => (
                        <li key={f.name} className="flex justify-between items-center border-b pb-2 last:border-b-0 hover:bg-slate-50 -mx-2 px-2 rounded-md">
                        <span className="flex items-center gap-2">
                            {f.type === 'markdown' ? <FileText className="h-4 w-4 text-muted-foreground" /> : <FileJson className="h-4 w-4 text-muted-foreground" />}
                            {f.name}
                        </span>
                        <a href={f.url} className="text-primary hover:underline inline-flex items-center gap-2 text-sm">
                            <Download className="h-4 w-4" /> Download
                        </a>
                        </li>
                    ))}
                    </ul>
                </div>
            )
        })}
      </div>

      <p className="text-xs text-muted-foreground pt-4">
        Files are read-only and served from the project repository. Path traversal is prevented.
      </p>
    </div>
  );
}
