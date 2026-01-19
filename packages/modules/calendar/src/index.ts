import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerCalendarModule() {
  moduleRegistry.register(manifest);
}
