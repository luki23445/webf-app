import type { FastifyInstance } from 'fastify';
import { hasPermission, Errors } from '@webf/core';
import { PageSpeedService } from './services/pagespeed-service';
import { createPageSpeedTargetSchema } from '@webf/shared';

export async function registerPageSpeedRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');
  const service = new PageSpeedService(getDb);

  app.post('/api/pagespeed/targets', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'pagespeed:create')) {
      throw Errors.forbidden();
    }
    const body = createPageSpeedTargetSchema.parse(request.body);
    const target = await getDb().pageSpeedTarget.create({ data: body });
    return reply.status(201).send({ data: target });
  });

  app.post('/api/pagespeed/targets/:id/trigger', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'pagespeed:trigger')) {
      throw Errors.forbidden();
    }
    const snapshots = await service.createSnapshot(request.auth!, request.params.id as string);
    return reply.send({ data: snapshots });
  });
}
