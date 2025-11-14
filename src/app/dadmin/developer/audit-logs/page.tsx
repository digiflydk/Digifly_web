
import { getDb } from "@/lib/firebase-admin";
import { AuditLogList } from "./_components/AuditLogList";

export const dynamic = 'force-dynamic';

async function getLogs() {
    const db = await getDb();
    const snap = await db.collection("auditLogs").orderBy("ts", "desc").limit(50).get();
    if (snap.empty) {
        return [];
    }
    const logs = snap.docs.map(d => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            // Convert Firestore timestamp to a serializable format
            ts: data.ts?.toDate?.().toISOString() ?? new Date().toISOString(),
        };
    });
    return logs;
}

export default async function AuditLogsPage() {
    const logs = await getLogs();
    return <AuditLogList logs={logs} />;
}
