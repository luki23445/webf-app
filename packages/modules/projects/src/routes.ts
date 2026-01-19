import type { FastifyInstance } from 'fastify';
import { ProjectService } from './services';
import { createProjectSchema, updateProjectSchema } from '@webf/shared';
import { Errors } from '@webf/core';

export async function registerProjectRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');
  const service = new ProjectService(getDb);

  // List projects
  app.get('/api/projects', async (request, reply) => {
    await request.requireAuth();
    const projects = await service.list(request.auth!, {
      status: request.query.status as string | undefined,
      clientId: request.query.clientId as string | undefined,
      assignedManagerId: request.query.assignedManagerId as string | undefined,
      search: request.query.search as string | undefined,
    });
    return reply.send({ data: projects });
  });

  // Get project by ID
  app.get('/api/projects/:id', async (request, reply) => {
    await request.requireAuth();
    const project = await service.getById(request.auth!, request.params.id as string);
    return reply.send({ data: project });
  });

  // Create project
  app.post('/api/projects', async (request, reply) => {
    await request.requireAuth();
    const body = createProjectSchema.parse(request.body);
    const project = await service.create(request.auth!, body);
    return reply.status(201).send({ data: project });
  });

  // Update project
  app.put('/api/projects/:id', async (request, reply) => {
    await request.requireAuth();
    const body = updateProjectSchema.parse(request.body);
    const project = await service.update(request.auth!, request.params.id as string, body);
    return reply.send({ data: project });
  });

  // Delete project
  app.delete('/api/projects/:id', async (request, reply) => {
    await request.requireAuth();
    await service.delete(request.auth!, request.params.id as string);
    return reply.send({ success: true });
  });
}
