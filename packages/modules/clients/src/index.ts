import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerClientsModule() {
  moduleRegistry.register(manifest);
}
