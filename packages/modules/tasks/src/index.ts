import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerTasksModule() {
  moduleRegistry.register(manifest);
}

export * from './services';
export * from './repositories';
