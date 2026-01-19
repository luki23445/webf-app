import type { FastifyInstance } from 'fastify';
import { hasPermission, Errors } from '@webf/core';

export async function registerAuditRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');

  app.get('/api/audit', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'audit:read')) {
      throw Errors.forbidden();
    }

    const logs = await getDb().auditLog.findMany({
      where: {
        organizationId: request.auth!.organizationId,
        ...(request.query.entityType && { entityType: request.query.entityType as string }),
        ...(request.query.entityId && { entityId: request.query.entityId as string }),
        ...(request.query.userId && { userId: request.query.userId as string }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return reply.send({ data: logs });
  });
}
