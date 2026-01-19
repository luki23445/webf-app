import cron from 'node-cron';
import { logger } from '@webf/core';
import { getDb } from './db';
import { PageSpeedService } from '../../packages/modules/pagespeed/src/services/pagespeed-service';
import { outboxWorker } from '../../packages/modules/integrations/src/outbox-worker';

export function setupScheduler() {
  // PageSpeed daily fetch
  const pagespeedCron = process.env.PAGESPEED_CRON || '0 2 * * *';
  cron.schedule(pagespeedCron, async () => {
    logger.info('Running PageSpeed daily fetch');
    try {
      const service = new PageSpeedService();
      const targets = await getDb().pageSpeedTarget.findMany({
        where: { active: true },
        include: { project: true },
      });

      for (const target of targets) {
        try {
          // Get organization context (simplified - in production, you'd need proper context)
          const orgId = target.project.organizationId;
          const context = {
            userId: 'system',
            organizationId: orgId,
            email: 'system@webf.app',
            roles: [],
            permissions: [],
          } as any;

          await service.createSnapshot(context, target.id);
          logger.info({ targetId: target.id }, 'PageSpeed snapshot created');
        } catch (error) {
          logger.error({ error, targetId: target.id }, 'Failed to create PageSpeed snapshot');
        }
      }
    } catch (error) {
      logger.error({ error }, 'PageSpeed scheduler error');
    }
  });

  // Outbox worker
  if (process.env.SCHEDULER_ENABLED === 'true') {
    outboxWorker();
  }

  logger.info('Scheduler initialized');
}
