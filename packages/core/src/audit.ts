import type { AuthContext } from './types';
import { getDb } from './db';
import { logger } from './logger';

export interface AuditLogEntry {
  organizationId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log audit entry
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await getDb().auditLog.create({
      data: {
        organizationId: entry.organizationId,
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadataJson: entry.metadata ? JSON.stringify(entry.metadata) : null,
      },
    });
  } catch (error) {
    // Don't fail the operation if audit log fails
    logger.error({ error, entry }, 'Failed to write audit log');
  }
}

/**
 * Create audit log helper with context
 */
export function createAuditLogger(context: AuthContext) {
  return {
    log: (action: string, entityType: string, entityId: string, metadata?: Record<string, unknown>) =>
      auditLog({
        organizationId: context.organizationId,
        userId: context.userId,
        action,
        entityType,
        entityId,
        metadata,
      }),
  };
}
