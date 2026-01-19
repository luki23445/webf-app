import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerResourcesModule() {
  moduleRegistry.register(manifest);
}
