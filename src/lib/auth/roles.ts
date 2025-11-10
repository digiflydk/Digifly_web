
export type Role = 'admin' | 'superadmin';

/**
 * Checks if a role string is 'superadmin'.
 * @param r The role string to check.
 * @returns True if the role is 'superadmin'.
 */
export const isSuperadmin = (r?: string | null): r is 'superadmin' => r === 'superadmin';

/**
 * Checks if a role string is 'admin' or 'superadmin'.
 * @param r The role string to check.
 * @returns True if the user has at least admin privileges.
 */
export const isAdmin = (r?: string | null): r is 'admin' | 'superadmin' => r === 'admin' || r === 'superadmin';
