import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'calendar',
  version: '1.0.0',
  description: 'Google Calendar integration',
  permissions: ['calendar:read', 'calendar:create', 'calendar:sync'],
};
