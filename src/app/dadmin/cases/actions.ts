
'use server';

import { deleteCaseServer } from '@/lib/cms-server';
import { logAdminAction } from '@/lib/dadmin/audit';
import { revalidatePath } from 'next/cache';

export async function deleteCaseAction(id: string) {
  try {
    const result = await deleteCaseServer(id);
    if (!result.ok) {
      throw new Error(result.error || 'Failed to delete from server.');
    }
    await logAdminAction({
      action: 'cases.save', // Assuming 'save' covers delete for logging purposes
      status: 'ok',
      path: `cases/${id}`,
      payloadSummary: `Deleted case: ${id}`,
    });
    revalidatePath('/dadmin/cases');
    return { ok: true };
  } catch (err: any) {
    console.error(`[deleteCaseAction]`, err);
    await logAdminAction({
      action: 'cases.save',
      status: 'error',
      path: `cases/${id}`,
      payloadSummary: `Failed to delete case: ${id}`,
      errorMessage: err.message,
    });
    return { ok: false, error: err.message };
  }
}
