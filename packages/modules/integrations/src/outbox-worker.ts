import { logger } from '@webf/core';
import crypto from 'crypto';

export async function outboxWorker() {
  const { getDb } = await import('../../../../apps/api/src/db');
  const interval = parseInt(process.env.OUTBOX_RETRY_INTERVAL || '30', 10) * 1000;

  setInterval(async () => {
    try {
      const events = await getDb().outboxEvent.findMany({
        where: {
          status: 'pending',
          OR: [
            { nextRetryAt: null },
            { nextRetryAt: { lte: new Date() } },
          ],
        },
        take: 10,
      });

      for (const event of events) {
        await processOutboxEvent(event);
      }
    } catch (error) {
      logger.error({ error }, 'Outbox worker error');
    }
  }, interval);
}

async function processOutboxEvent(event: any) {
  const { getDb } = await import('../../../../apps/api/src/db');
  const config = await getDb().integrationConfig.findUnique({
    where: { organizationId_type: { organizationId: event.organizationId, type: 'n8n' } },
  });

  if (!config) {
    await getDb().outboxEvent.update({
      where: { id: event.id },
      data: { status: 'failed' },
    });
    return;
  }

  const configData = config.configJson as any;
  const webhookUrl = configData.webhookUrl;
  const secret = configData.secret;

  if (!webhookUrl) {
    return;
  }

  try {
    const payload = JSON.stringify(event.payloadJson);
    const signature = secret ? crypto.createHmac('sha256', secret).update(payload).digest('hex') : null;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(signature && { 'X-Webhook-Signature': signature }),
        'X-Idempotency-Key': event.id,
      },
      body: payload,
    });

    if (response.ok) {
      await getDb().outboxEvent.update({
        where: { id: event.id },
        data: { status: 'sent' },
      });
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    const retries = event.retries + 1;
    const nextRetryAt = new Date(Date.now() + Math.pow(2, retries) * 1000); // Exponential backoff

    if (retries >= 5) {
      await getDb().outboxEvent.update({
        where: { id: event.id },
        data: { status: 'failed', retries },
      });
    } else {
      await getDb().outboxEvent.update({
        where: { id: event.id },
        data: { retries, nextRetryAt },
      });
    }
  }
}
