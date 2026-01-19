import type { FastifyInstance } from 'fastify';
import { registerProjectsModule } from '../../packages/modules/projects';
import { registerTasksModule } from '../../packages/modules/tasks';
import { registerTimeModule } from '../../packages/modules/time';
import { registerClientsModule } from '../../packages/modules/clients';
import { registerResourcesModule } from '../../packages/modules/resources';
import { registerPageSpeedModule } from '../../packages/modules/pagespeed';
import { registerCalendarModule } from '../../packages/modules/calendar';
import { registerIntegrationsModule } from '../../packages/modules/integrations';
import { registerAuditModule } from '../../packages/modules/audit';

import { registerProjectRoutes } from '../../packages/modules/projects/src/routes';
import { registerTaskRoutes } from '../../packages/modules/tasks/src/routes';
import { registerTimeRoutes } from '../../packages/modules/time/src/routes';
import { registerClientRoutes } from '../../packages/modules/clients/src/routes';
import { registerResourceRoutes } from '../../packages/modules/resources/src/routes';
import { registerPageSpeedRoutes } from '../../packages/modules/pagespeed/src/routes';
import { registerAuditRoutes } from '../../packages/modules/audit/src/routes';
import { registerIntegrationRoutes } from '../../packages/modules/integrations/src/routes';

export async function registerModules(app: FastifyInstance) {
  // Register all modules (manifests)
  registerProjectsModule();
  registerTasksModule();
  registerTimeModule();
  registerClientsModule();
  registerResourcesModule();
  registerPageSpeedModule();
  registerCalendarModule();
  registerIntegrationsModule();
  registerAuditModule();

  // Register routes
  await registerProjectRoutes(app);
  await registerTaskRoutes(app);
  await registerTimeRoutes(app);
  await registerClientRoutes(app);
  await registerResourceRoutes(app);
  await registerPageSpeedRoutes(app);
  await registerAuditRoutes(app);
  await registerIntegrationRoutes(app);
}
