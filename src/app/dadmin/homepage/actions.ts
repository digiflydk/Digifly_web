
"use server";

import type { HomePage } from "@/lib/schemas";
import { saveHomepageAction as saveHomepageInCmsActions } from "@/lib/server/cms-actions";

/**
 * Server Action for the admin UI to save homepage data.
 * This is a thin wrapper around the canonical action in /lib/server.
 */
export async function saveHomepageAction(payload: HomePage) {
  // DGF-427: Delegate to the canonical, testable server action.
  return await saveHomepageInCmsActions(payload);
}
