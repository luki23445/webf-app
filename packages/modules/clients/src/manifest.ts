import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'clients',
  version: '1.0.0',
  description: 'Client management module',
  permissions: ['clients:read', 'clients:create', 'clients:update', 'clients:delete'],
  navigation: [
    {
      label: 'Klienci',
      path: '/clients',
      icon: 'users',
      permissions: ['clients:read'],
    },
  ],
};
