import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'resources',
  version: '1.0.0',
  description: 'Project resources module',
  permissions: ['resources:read', 'resources:create', 'resources:update', 'resources:delete'],
};
