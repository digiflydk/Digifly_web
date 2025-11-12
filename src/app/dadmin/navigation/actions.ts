
"use server";

import { revalidatePath } from "next/cache";
import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import type { Navigation } from "@/lib/types";
import { NavigationSchema } from "@/lib/schemas";
import { CMS_PATHS } from "@/lib/constants";


export async function saveNavigationAction(data: Navigation): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = await getFirestore(getAdminApp());
    const parsedData = NavigationSchema.parse(data);
    await db.doc(CMS_PATHS.navigation).set(parsedData, { merge: true });
    revalidatePath("/dadmin/navigation");
    revalidatePath("/", "layout"); 
    return { ok: true };
  } catch (err: any) {
    console.error("[saveNavigationAction] Error:", err);
    return { ok: false, error: err.message || "An unknown error occurred." };
  }
}
