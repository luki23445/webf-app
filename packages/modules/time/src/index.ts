import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerTimeModule() {
  moduleRegistry.register(manifest);
}
