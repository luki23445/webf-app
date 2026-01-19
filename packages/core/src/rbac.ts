import type { AuthContext } from './types';

/**
 * Check if user has permission
 */
export function hasPermission(context: AuthContext, permission: string): boolean {
  return context.permissions.includes(permission);
}

/**
 * Check if user has any of the permissions
 */
export function hasAnyPermission(context: AuthContext, permissions: string[]): boolean {
  return permissions.some((perm) => context.permissions.includes(perm));
}

/**
 * Check if user has all permissions
 */
export function hasAllPermissions(context: AuthContext, permissions: string[]): boolean {
  return permissions.every((perm) => context.permissions.includes(perm));
}

/**
 * Check if user has role
 */
export function hasRole(context: AuthContext, role: string): boolean {
  return context.roles.includes(role);
}

/**
 * Check if user has any of the roles
 */
export function hasAnyRole(context: AuthContext, roles: string[]): boolean {
  return roles.some((role) => context.roles.includes(role));
}

/**
 * Create permission guard function
 */
export function requirePermission(permission: string) {
  return (context: AuthContext): boolean => {
    if (!hasPermission(context, permission)) {
      throw new Error(`Permission denied: ${permission}`);
    }
    return true;
  };
}

/**
 * Create role guard function
 */
export function requireRole(role: string) {
  return (context: AuthContext): boolean => {
    if (!hasRole(context, role)) {
      throw new Error(`Role required: ${role}`);
    }
    return true;
  };
}
