import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { logger } from '@webf/core';
import { registerModules } from './modules';
import { setupAuth } from './plugins/auth';
import { setupErrorHandler } from './plugins/error-handler';
import { setupScheduler } from './scheduler';

const PORT = parseInt(process.env.API_PORT || '3001', 10);
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

async function buildApp() {
  const app = Fastify({
    logger: logger.child({ component: 'api' }),
  });

  // Security
  await app.register(helmet);
  await app.register(cors, {
    origin: WEB_URL,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Error handling
  setupErrorHandler(app);

  // Auth
  await setupAuth(app);

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Auth routes
  const { registerAuthRoutes } = await import('./routes/auth');
  await registerAuthRoutes(app);

  // Register modules
  await registerModules(app);

  return app;
}

async function start() {
  try {
    const app = await buildApp();

    await app.listen({ port: PORT, host: '0.0.0.0' });
    logger.info({ port: PORT }, 'API server started');

    // Start scheduler if enabled
    if (process.env.SCHEDULER_ENABLED === 'true') {
      setupScheduler();
      logger.info('Scheduler started');
    }
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
