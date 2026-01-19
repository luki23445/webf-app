import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'tasks',
  version: '1.0.0',
  description: 'Task management module',
  permissions: [
    'tasks:read',
    'tasks:create',
    'tasks:update',
    'tasks:delete',
  ],
  events: {
    published: [
      'task.created',
      'task.updated',
      'task.completed',
      'task.status_changed',
    ],
  },
};
