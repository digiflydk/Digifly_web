
"use server";
import 'server-only';
import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Role } from './roles';
import { SESSION_COOKIE_NAME } from '../constants';

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

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
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
    return null;
  }
});
