
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: {
    qaRunId: string;
  };
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { qaRunId } = params;
    
    const db = await getDb();
    if (!db) {
      throw new Error("Firestore database is not available.");
    }

    const docRef = db.collection('qaRuns').doc(qaRunId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "QA run not found." }, { status: 404 });
    }

    const run = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    return NextResponse.json(run);

  } catch (error: any) {
    console.error(`[API GET /api/dadmin/qw/runs/${params.qaRunId}]`, error);
    return NextResponse.json({ error: "Unable to load QA run." }, { status: 500 });
  }
}
