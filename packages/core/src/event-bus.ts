import type { EventPayload } from './types';

type EventHandler = (payload: EventPayload) => void | Promise<void>;

/**
 * In-process Event Bus for module communication
 */
export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  /**
   * Subscribe to an event type
   */
  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Publish an event
   */
  async publish(payload: EventPayload): Promise<void> {
    const handlers = this.handlers.get(payload.type);
    if (!handlers || handlers.size === 0) {
      return;
    }

    // Execute all handlers (parallel)
    await Promise.all(
      Array.from(handlers).map(async (handler) => {
        try {
          await handler(payload);
        } catch (error) {
          // Log error but don't fail other handlers
          console.error(`Error in event handler for ${payload.type}:`, error);
        }
      })
    );
  }

  /**
   * Get all subscribed event types
   */
  getSubscribedTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}

// Singleton instance
export const eventBus = new EventBus();
