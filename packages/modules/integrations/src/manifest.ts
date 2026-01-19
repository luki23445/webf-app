import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'integrations',
  version: '1.0.0',
  description: 'External integrations (n8n)',
  permissions: ['integrations:read', 'integrations:update'],
  navigation: [
    {
      label: 'Integracje',
      path: '/admin/integrations',
      icon: 'settings',
      permissions: ['integrations:read'],
    },
  ],
  events: {
    subscribed: [
      'project.created',
      'project.updated',
      'task.created',
      'task.completed',
      'time.logged',
      'pagespeed.snapshot.created',
    ],
  },
};
