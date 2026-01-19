import jwt from 'jsonwebtoken';
import type { AuthContext } from './types';

export interface JwtPayload {
  userId: string;
  organizationId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  return parts[1];
}

/**
 * Create AuthContext from JWT payload
 */
export function createAuthContext(payload: JwtPayload): AuthContext {
  return {
    userId: payload.userId,
    organizationId: payload.organizationId,
    email: payload.email,
    roles: payload.roles,
    permissions: payload.permissions,
  };
}
