import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerAuditModule() {
  moduleRegistry.register(manifest);
}
