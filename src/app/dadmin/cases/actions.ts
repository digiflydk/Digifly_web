
'use server';

import { createCase, updateCase, deleteCase as deleteCaseServer } from '@/lib/cms-server';
import { logAdminAction } from '@/lib/dadmin/audit';
import { revalidatePath } from 'next/cache';
import { CaseSchema, type CaseDoc } from '@/lib/schemas.case';

export async function createCaseAction(data: CaseDoc) {
  try {
    const parsed = CaseSchema.parse(data);
    const created = await createCase(parsed);
    revalidatePath('/dadmin/cases');
    revalidatePath('/cases');
    return { ok: true, data: created };
  } catch (err: any) {
    console.error(`[createCaseAction]`, err);
    await logAdminAction({
      action: 'cases.save',
      status: 'error',
      payloadSummary: `Failed to create case: ${data.title}`,
      errorMessage: err.message,
    });
    return { ok: false, error: err.message };
  }
}

export async function updateCaseAction(data: CaseDoc) {
    const id = data.id;
    if (!id) return { ok: false, error: "Document ID is missing." };
  try {
    const parsed = CaseSchema.parse(data);
    const updated = await updateCase(id, parsed);
    revalidatePath('/dadmin/cases');
    revalidatePath(`/cases/${updated.slug}`);
    return { ok: true, data: updated };
  } catch (err: any) {
    console.error(`[updateCaseAction]`, err);
    await logAdminAction({
      action: 'cases.save',
      status: 'error',
      path: `cases/${id}`,
      payloadSummary: `Failed to update case: ${data.title}`,
      errorMessage: err.message,
    });
    return { ok: false, error: err.message };
  }
}


export async function deleteCaseAction(id: string) {
  try {
    const result = await deleteCaseServer(id);
    if (!result.ok) {
      throw new Error(result.error || 'Failed to delete from server.');
    }
    await logAdminAction({
      action: 'cases.save',
      status: 'ok',
      path: `cases/${id}`,
      payloadSummary: `Deleted case: ${id}`,
    });
    revalidatePath('/dadmin/cases');
    revalidatePath('/cases');
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
