import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerPageSpeedModule() {
  moduleRegistry.register(manifest);
}
