
import { NextResponse } from 'next/server';
import { docx, Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { PLAYBOOK_CONTENT } from '@/app/dadmin/developer/playbook/PlaybookContent';
import { getDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getPlaybookMeta() {
  try {
    const db = await getDb();
    const docRef = db.doc('developer/playbook');
    const snap = await docRef.get();
    if (snap.exists) {
      const data = snap.data()!;
      return {
        version: data.version || '1.0.0',
        lastUpdated: data.lastUpdated?.toDate?.() ?? new Date(),
      };
    }
  } catch (error) {
    console.error("Failed to get playbook meta from Firestore:", error);
  }
  return { version: '1.0.0', lastUpdated: new Date() };
}

export async function GET() {
  try {
    const meta = await getPlaybookMeta();
    const { version, lastUpdated } = meta;

    const sections = PLAYBOOK_CONTENT.split(/(\n# |\n## |\n### )/).slice(1);
    const children: Paragraph[] = [
      new Paragraph({
        text: 'Digifly Engineering Playbook',
        heading: HeadingLevel.TITLE,
        style: 'Title',
      }),
      new Paragraph({
        text: `Version: ${version} | Last Updated: ${lastUpdated.toISOString()}`,
        style: 'Subtitle',
      }),
    ];

    for (let i = 0; i < sections.length; i += 2) {
      const levelMarker = sections[i].trim();
      const contentBlock = sections[i + 1];
      const [title, ...rest] = contentBlock.split('\n');

      let headingLevel;
      if (levelMarker === '#') headingLevel = HeadingLevel.HEADING_1;
      else if (levelMarker === '##') headingLevel = HeadingLevel.HEADING_2;
      else headingLevel = HeadingLevel.HEADING_3;
      
      children.push(new Paragraph({ text: title, heading: headingLevel }));
      
      const body = rest.join('\n').trim();
      body.split('\n').forEach(line => {
        if (line.startsWith('- ')) {
          children.push(new Paragraph({ text: line.substring(2), bullet: { level: 0 } }));
        } else if (line.trim()) {
          children.push(new Paragraph(line));
        }
      });
    }

    const doc = new Document({
      sections: [{ children }],
      styles: {
        paragraphStyles: [{
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 56, bold: true, color: "2E74B5" },
        },{
          id: 'Subtitle',
          name: 'Subtitle',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 24, italics: true, color: "595959" },
        }]
      }
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Digifly-Engineering-Playbook-v${version}.docx"`,
      },
    });
  } catch (error) {
    console.error("[Playbook Export] Failed to generate DOCX", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(`Failed to generate DOCX: ${errorMessage}`, { status: 500 });
  }
}
