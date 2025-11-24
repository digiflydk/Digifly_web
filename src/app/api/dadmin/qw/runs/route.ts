
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Firestore database is not available.");
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");

    let query: FirebaseFirestore.Query = db.collection('qaRuns');

    if (taskId) {
      query = query.where('taskId', '==', taskId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    // Cap limit at 50 for safety
    const finalLimit = Math.min(Math.max(1, limit), 50);

    const snapshot = await query.orderBy('startedAt', 'desc').limit(finalLimit).get();

    const runs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ runs });

  } catch (error: any) {
    console.error("[API GET /api/dadmin/qw/runs]", error);
    return NextResponse.json({ error: "Unable to load QA runs." }, { status: 500 });
  }
}
