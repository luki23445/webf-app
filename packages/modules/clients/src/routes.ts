import type { FastifyInstance } from 'fastify';
import { hasPermission, Errors, createAuditLogger } from '@webf/core';
import { createClientSchema, updateClientSchema } from '@webf/shared';

export async function registerClientRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');

  app.get('/api/clients', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'clients:read')) {
      throw Errors.forbidden();
    }

    const clients = await getDb().client.findMany({
      where: { organizationId: request.auth!.organizationId },
      include: {
        _count: { select: { projects: true } },
      },
      orderBy: { name: 'asc' },
    });

    return reply.send({ data: clients });
  });

  app.post('/api/clients', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'clients:create')) {
      throw Errors.forbidden();
    }

    const body = createClientSchema.parse(request.body);
    const client = await getDb().client.create({
      data: {
        ...body,
        organizationId: request.auth!.organizationId,
      },
    });

    const audit = createAuditLogger(request.auth!);
    await audit.log('create', 'client', client.id, { name: client.name });

    return reply.status(201).send({ data: client });
  });

  app.put('/api/clients/:id', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'clients:update')) {
      throw Errors.forbidden();
    }

    const body = updateClientSchema.parse(request.body);
    const client = await getDb().client.update({
      where: {
        id: request.params.id as string,
        organizationId: request.auth!.organizationId,
      },
      data: body,
    });

    const audit = createAuditLogger(request.auth!);
    await audit.log('update', 'client', client.id, { changes: body });

    return reply.send({ data: client });
  });
}
