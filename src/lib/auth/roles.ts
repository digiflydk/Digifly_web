
// Public mode: all checks pass, no session required.
export function isAdmin() { return true; }
export function isSuperadmin() { return true; }
export async function requireAdmin() { return true; }
export async function requireSuperadmin() { return true; }

export type Role = 'admin' | 'superadmin';
