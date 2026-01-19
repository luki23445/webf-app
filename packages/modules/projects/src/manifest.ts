import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'projects',
  version: '1.0.0',
  description: 'Project management module',
  permissions: [
    'projects:read',
    'projects:create',
    'projects:update',
    'projects:delete',
  ],
  navigation: [
    {
      label: 'Projekty',
      path: '/projects',
      icon: 'folder',
      permissions: ['projects:read'],
    },
  ],
  events: {
    published: [
      'project.created',
      'project.updated',
      'project.status_changed',
      'project.deleted',
    ],
  },
};
