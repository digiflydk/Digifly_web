"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText } from "lucide-react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { siteConfig } from "@/config/site";

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

    return groups;
}


export function DocsList() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [isLoading, setIsLoading] = useState({ md: false, json: false });

  useEffect(() => {
    fetch("/api/docs/list")
      .then(res => res.json())
      .then(data => setFiles(data.files || []));
  }, []);

  const handleDownloadAll = async (type: 'md' | 'json') => {
    setIsLoading(prev => ({ ...prev, [type]: true }));

    const filesToDownload = files.filter(f => f.type === (type === 'md' ? 'markdown' : 'json'));
    const zip = new JSZip();

    for (const file of filesToDownload) {
      try {
        const res = await fetch(file.url);
        const blob = await res.blob();
        zip.file(file.name, blob);
      } catch (error) {
        console.error(`Failed to fetch ${file.name}`, error);
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${siteConfig.name}-docs-${type}-bundle.zip`);
    setIsLoading(prev => ({ ...prev, [type]: false }));
  }

  const groupedFiles = groupFiles(files);


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => handleDownloadAll('md')} disabled={isLoading.md}>
            {isLoading.md ? 'Bundling...' : 'Download Markdown Bundle (.zip)'}
        </Button>
        <Button variant="secondary" onClick={() => handleDownloadAll('json')} disabled={isLoading.json}>
            {isLoading.json ? 'Bundling...' : 'Download JSON Bundle (.zip)'}
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([groupName, files]) => {
            if (files.length === 0) return null;
            return (
                <div key={groupName}>
                    <h2 className="text-xl font-semibold mb-3 border-b pb-2">{groupName}</h2>
                    <ul className="space-y-2 mt-4">
                    {files.map(f => (
                        <li key={f.name} className="flex justify-between items-center border-b pb-2 last:border-b-0">
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
