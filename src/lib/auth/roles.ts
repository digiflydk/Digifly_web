
import 'server-only';
import { getCurrentUser } from './serverAuth';

export type Role = 'admin' | 'superadmin';

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user && (user.role === 'admin' || user.role === 'superadmin');
}

export async function isSuperadmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user && user.role === 'superadmin';
}

export async function requireAdmin(): Promise<void> {
    if (!await isAdmin()) {
        throw new Error('Permission denied: Admin role required.');
    }
}

export async function requireSuperadmin(): Promise<void> {
    if (!await isSuperadmin()) {
        throw new Error('Permission denied: Superadmin role required.');
    }
}
