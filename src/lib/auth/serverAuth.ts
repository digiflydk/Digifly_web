
"use server";
// DGF-421, DGF-423: This file may be imported by tests, so 'server-only' must be guarded.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('server-only');
} catch {}


import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import type { Role } from './roles';
import { SESSION_COOKIE_NAME } from '../constants';

// DGF-425: Safe wrapper around React cache so acceptance tests can run without Next.js runtime.
let safeCache: <T extends (...args: any[]) => any>(fn: T) => T;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const react = require('react');
  if (typeof react.cache === 'function') {
    safeCache = react.cache;
  } else {
    // Fallback: no caching, just return the original function.
    safeCache = ((fn: any) => fn) as any;
  }
} catch {
  // In test / non-Next environments, 'react' or 'react.cache' may not be available.
  safeCache = ((fn: any) => fn) as any;
}


const SESSION_DURATION_DAYS = 5;

export type CurrentUser = {
  uid: string;
  email: string | undefined;
  role: Role | null;
};

export async function createSessionCookie(idToken: string): Promise<void> {
  const expiresIn = 60 * 60 * 24 * SESSION_DURATION_DAYS * 1000;
  const sessionCookie = await getAuth(getAdminApp()).createSessionCookie(idToken, { expiresIn });
  
  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

export async function clearSessionCookie(): Promise<void> {
  cookies().set(SESSION_COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export const getCurrentUser = safeCache(async (): Promise<CurrentUser | null> => {
  let sessionCookieValue;
  try {
    sessionCookieValue = cookies().get(SESSION_COOKIE_NAME)?.value;
  } catch (error) {
    // This will throw in non-Next.js environments (like Playwright tests)
    // We can safely return null in that case.
    return null;
  }
  
  if (!sessionCookieValue) {
    return null;
  }
  
  try {
    const decodedClaims = await getAuth(getAdminApp()).verifySessionCookie(sessionCookieValue, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: (decodedClaims.role as Role) || null,
    };
  } catch (error) {
    return null;
  }
});
