
"use server";
import 'server-only';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';
import type { Role } from './roles';

const SESSION_COOKIE_NAME = '__session';

export type CurrentUser = {
  uid: string;
  email: string | undefined;
  role: Role | null;
};

export async function createSessionCookie(idToken: string): Promise<void> {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await getAuth(getAdminApp()).createSessionCookie(idToken, { expiresIn });
  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  cookies().set(SESSION_COOKIE_NAME, '', { maxAge: 0 });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await getAuth(getAdminApp()).verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: (decodedClaims.role as Role) || null,
    };
  } catch (error) {
    console.warn("[serverAuth] Could not verify session cookie:", error);
    return null;
  }
}
