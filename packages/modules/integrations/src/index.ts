import { moduleRegistry, eventBus } from '@webf/core';
import { manifest } from './manifest';
import { outboxWorker } from './outbox-worker';

export function registerIntegrationsModule() {
  moduleRegistry.register(manifest);

  // Subscribe to events and add to outbox
  const eventTypes = manifest.events?.subscribed || [];
  for (const eventType of eventTypes) {
    eventBus.subscribe(eventType, async (payload) => {
      await addToOutbox(payload);
    });
  }
}

async function addToOutbox(payload: any) {
  const { getDb } = await import('../../../../apps/api/src/db');
  await getDb().outboxEvent.create({
    data: {
      organizationId: payload.organizationId,
      eventType: payload.type,
      payloadJson: payload,
      status: 'pending',
    },
  });
}

export { outboxWorker };
