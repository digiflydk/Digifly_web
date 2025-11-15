
import { buildSeo } from "@/lib/seo";
import type { Metadata } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { PLAYBOOK_CONTENT } from './PlaybookContent';
import { getDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'Engineering Playbook',
    description: 'Architecture, Testing, Documentation, Processes.',
    noIndex: true,
  });
}

async function getPlaybookMeta() {
  const PLAYBOOK_VERSION = '1.0.2'; // The version defined in the playbook content
  try {
    const db = await getDb();
    const docRef = db.doc('developer/playbook');
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.version !== PLAYBOOK_VERSION) {
      const newMeta = { version: PLAYBOOK_VERSION, lastUpdated: FieldValue.serverTimestamp(), updatedBy: 'system' };
      await docRef.set(newMeta, { merge: true });
      return { ...newMeta, lastUpdated: new Date().toISOString() };
    }
    const data = snap.data()!;
    return {
      version: data.version || PLAYBOOK_VERSION,
      lastUpdated: data.lastUpdated?.toDate?.().toISOString() ?? new Date().toISOString(),
      updatedBy: data.updatedBy || 'system',
    };
  } catch (error) {
    console.error("[Playbook Page] Failed to fetch/update metadata:", error);
    return { version: PLAYBOOK_VERSION, lastUpdated: new Date().toISOString(), updatedBy: 'local' };
  }
}

export default async function PlaybookPage() {
  const meta = await getPlaybookMeta();
  const playbookHtml = PLAYBOOK_CONTENT
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-4 mb-2">$1</h4>')
    .replace(/\n- (.*)/g, '\n<li class="ml-4">$1</li>')
    .replace(/<ul>\s*<li/g, '<ul class="list-disc list-inside space-y-2"> <li')
    .replace(/<\/li>\s*<\/ul>/g, '</li></ul>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-slate-800 rounded px-1 py-0.5 font-mono text-sm">$1</code>');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Digifly Engineering Playbook</h1>
          <p className="text-muted-foreground">Architecture • Testing • Documentation • Processes</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground text-right">
                <div>Version: {meta.version}</div>
                <div>Last updated: {new Date(meta.lastUpdated).toLocaleDateString()}</div>
            </div>
          <Button asChild>
            <Link href="/api/developer/playbook/export" target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Download as Word (.docx)
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: playbookHtml }} />
        </CardContent>
      </Card>
    </div>
  );
}
