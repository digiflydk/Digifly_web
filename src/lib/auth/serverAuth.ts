
"use server";
import 'server-only';
import type { Role } from './roles';

const SESSION_COOKIE_NAME = '__session';

export type CurrentUser = {
  uid: string;
  email: string | undefined;
  role: Role | null;
};

export async function createSessionCookie(idToken: string): Promise<void> {
  // No-op in public mode
}

export async function clearSessionCookie(): Promise<void> {
  // No-op in public mode
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  // No-op in public mode, always return null as there is no user.
  return null;
}
