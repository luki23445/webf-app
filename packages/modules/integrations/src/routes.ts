import type { FastifyInstance } from 'fastify';
import { hasPermission, Errors, encrypt } from '@webf/core';
import { updateIntegrationConfigSchema, n8nCreateTaskSchema, n8nUpdateProjectStatusSchema, n8nAddCalendarEventSchema } from '@webf/shared';

export async function registerIntegrationRoutes(app: FastifyInstance) {
  const { getDb } = await import('../../../../apps/api/src/db');

  // Get/Update integration config
  app.get('/api/integrations/:type', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'integrations:read')) {
      throw Errors.forbidden();
    }

    const config = await getDb().integrationConfig.findUnique({
      where: {
        organizationId_type: {
          organizationId: request.auth!.organizationId,
          type: request.params.type as string,
        },
      },
    });

    return reply.send({ data: config });
  });

  app.put('/api/integrations/:type', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'integrations:update')) {
      throw Errors.forbidden();
    }

    const body = updateIntegrationConfigSchema.parse({ ...request.body, type: request.params.type });
    const configData = body.config as any;
    const encryptedFields: string[] = [];

    // Encrypt sensitive fields
    if (configData.apiKey) {
      configData.apiKey = encrypt(configData.apiKey);
      encryptedFields.push('apiKey');
    }
    if (configData.secret) {
      configData.secret = encrypt(configData.secret);
      encryptedFields.push('secret');
    }

    const config = await getDb().integrationConfig.upsert({
      where: {
        organizationId_type: {
          organizationId: request.auth!.organizationId,
          type: body.type,
        },
      },
      create: {
        organizationId: request.auth!.organizationId,
        type: body.type,
        configJson: configData,
        encryptedFields,
      },
      update: {
        configJson: configData,
        encryptedFields,
      },
    });

    return reply.send({ data: config });
  });

  // n8n webhook endpoints
  app.post('/api/integrations/n8n/actions/create-task', async (request, reply) => {
    // Verify secret
    const secret = request.headers['x-webhook-secret'] as string;
    if (!secret || secret !== process.env.N8N_WEBHOOK_SECRET) {
      throw Errors.unauthorized('Invalid webhook secret');
    }

    const body = n8nCreateTaskSchema.parse(request.body);
    // TODO: Create task using TaskService
    return reply.send({ success: true });
  });

  app.post('/api/integrations/n8n/actions/update-project-status', async (request, reply) => {
    const secret = request.headers['x-webhook-secret'] as string;
    if (!secret || secret !== process.env.N8N_WEBHOOK_SECRET) {
      throw Errors.unauthorized('Invalid webhook secret');
    }

    const body = n8nUpdateProjectStatusSchema.parse(request.body);
    // TODO: Update project status using ProjectService
    return reply.send({ success: true });
  });

  app.post('/api/integrations/n8n/actions/add-calendar-event', async (request, reply) => {
    const secret = request.headers['x-webhook-secret'] as string;
    if (!secret || secret !== process.env.N8N_WEBHOOK_SECRET) {
      throw Errors.unauthorized('Invalid webhook secret');
    }

    const body = n8nAddCalendarEventSchema.parse(request.body);
    // TODO: Create calendar event
    return reply.send({ success: true });
  });
}
