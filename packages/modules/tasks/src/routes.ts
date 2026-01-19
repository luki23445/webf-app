import type { FastifyInstance } from 'fastify';
import { TaskService } from './services';
import { createTaskSchema, updateTaskSchema } from '@webf/shared';
import { getDb } from '../../../../apps/api/src/db';

export async function registerTaskRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');
  const service = new TaskService(getDb);

  app.post('/api/tasks', async (request, reply) => {
    await request.requireAuth();
    const body = createTaskSchema.parse(request.body);
    const task = await service.create(request.auth!, body);
    return reply.status(201).send({ data: task });
  });

  app.put('/api/tasks/:id', async (request, reply) => {
    await request.requireAuth();
    const body = updateTaskSchema.parse(request.body);
    const task = await service.update(request.auth!, request.params.id as string, body);
    return reply.send({ data: task });
  });

  app.post('/api/tasks/:id/checklist', async (request, reply) => {
    await request.requireAuth();
    const { text } = request.body as { text: string };
    const item = await service.addChecklistItem(request.auth!, request.params.id as string, text);
    return reply.status(201).send({ data: item });
  });

  app.patch('/api/tasks/checklist/:itemId', async (request, reply) => {
    await request.requireAuth();
    const { done } = request.body as { done: boolean };
    const item = await service.toggleChecklistItem(request.auth!, request.params.itemId as string, done);
    return reply.send({ data: item });
  });
}
