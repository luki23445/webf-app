import type { FastifyInstance } from 'fastify';
import { hasPermission, Errors, eventBus, createAuditLogger } from '@webf/core';
import { createTimeEntrySchema, startTimerSchema } from '@webf/shared';

export async function registerTimeRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');

  app.post('/api/time', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'time:create')) {
      throw Errors.forbidden();
    }

    const body = createTimeEntrySchema.parse(request.body);
    const entry = await getDb().timeEntry.create({
      data: {
        projectId: body.projectId,
        taskId: body.taskId,
        userId: request.auth!.userId,
        minutes: body.minutes,
        note: body.note,
        startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
        endedAt: body.endedAt ? new Date(body.endedAt) : undefined,
        source: 'manual',
      },
    });

    await eventBus.publish({
      type: 'time.logged',
      data: { entryId: entry.id, projectId: body.projectId, minutes: body.minutes },
      timestamp: new Date(),
      userId: request.auth!.userId,
      organizationId: request.auth!.organizationId,
    });

    const audit = createAuditLogger(request.auth!);
    await audit.log('create', 'time_entry', entry.id, { minutes: body.minutes });

    return reply.status(201).send({ data: entry });
  });

  app.get('/api/time', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'time:read')) {
      throw Errors.forbidden();
    }

    const entries = await getDb().timeEntry.findMany({
      where: {
        organizationId: request.auth!.organizationId,
        ...(request.query.userId && { userId: request.query.userId as string }),
        ...(request.query.projectId && { projectId: request.query.projectId as string }),
        ...(request.query.startDate && {
          startedAt: { gte: new Date(request.query.startDate as string) },
        }),
        ...(request.query.endDate && {
          startedAt: { lte: new Date(request.query.endDate as string) },
        }),
      },
      include: {
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startedAt: 'desc' },
      take: 100,
    });

    return reply.send({ data: entries });
  });
}
