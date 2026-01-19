import type { FastifyInstance } from 'fastify';
import { hasPermission, Errors } from '@webf/core';
import {
  createDomainResourceSchema,
  createHostingResourceSchema,
  createDnsRecordSchema,
  createProjectLinkSchema,
} from '@webf/shared';

export async function registerResourceRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');

  // Domain resources
  app.post('/api/projects/:projectId/resources/domains', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'resources:create')) {
      throw Errors.forbidden();
    }
    const body = createDomainResourceSchema.parse({ ...request.body, projectId: request.params.projectId });
    const resource = await getDb().domainResource.create({ data: body });
    return reply.status(201).send({ data: resource });
  });

  // Hosting resources
  app.post('/api/projects/:projectId/resources/hosting', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'resources:create')) {
      throw Errors.forbidden();
    }
    const body = createHostingResourceSchema.parse({ ...request.body, projectId: request.params.projectId });
    const resource = await getDb().hostingResource.create({ data: body });
    return reply.status(201).send({ data: resource });
  });

  // DNS records
  app.post('/api/projects/:projectId/resources/dns', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'resources:create')) {
      throw Errors.forbidden();
    }
    const body = createDnsRecordSchema.parse({ ...request.body, projectId: request.params.projectId });
    const record = await getDb().dnsRecordPlan.create({ data: body });
    return reply.status(201).send({ data: record });
  });

  // Project links
  app.post('/api/projects/:projectId/resources/links', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'resources:create')) {
      throw Errors.forbidden();
    }
    const body = createProjectLinkSchema.parse({ ...request.body, projectId: request.params.projectId });
    const link = await getDb().projectLink.create({ data: body });
    return reply.status(201).send({ data: link });
  });
}
