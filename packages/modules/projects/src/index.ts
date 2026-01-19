import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerProjectsModule() {
  moduleRegistry.register(manifest);
}

export * from './services';
export * from './repositories';
