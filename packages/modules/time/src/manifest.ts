import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'time',
  version: '1.0.0',
  description: 'Time tracking module',
  permissions: ['time:read', 'time:create', 'time:update'],
  navigation: [
    {
      label: 'Czas pracy',
      path: '/time',
      icon: 'clock',
      permissions: ['time:read'],
    },
  ],
  events: {
    published: ['time.logged', 'time.timer_started', 'time.timer_stopped'],
  },
};
