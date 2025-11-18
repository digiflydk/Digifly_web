
'use server';

import { getHomepage } from '@/lib/cms-api';
import type { HomePage } from '@/lib/types';

/**
 * Shared helper used by both:
 * - API route handler for /api/cms/home
 * - Playwright acceptance tests (DGF-467)
 *
 * It must return the same shape as the current /api/cms/home endpoint.
 * Do not change the response contract.
 */
export async function getCmsHomePayload(): Promise<HomePage> {
  const homepage = await getHomepage();

  // IMPORTANT:
  // Do NOT change the returned shape. If /api/cms/home previously returned
  // the homepage object directly, keep that behaviour here.
  return homepage;
}
