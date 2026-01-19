import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'audit',
  version: '1.0.0',
  description: 'Audit log module',
  permissions: ['audit:read'],
};
