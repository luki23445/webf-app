import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'pagespeed',
  version: '1.0.0',
  description: 'PageSpeed Insights integration',
  permissions: ['pagespeed:read', 'pagespeed:create', 'pagespeed:trigger'],
  events: {
    published: ['pagespeed.snapshot.created'],
  },
};
