# Jak dodać nowy moduł

Ten dokument opisuje krok po kroku, jak dodać nowy moduł do aplikacji WebF.

## 1. Utwórz strukturę modułu

```bash
mkdir -p packages/modules/your-module/src/{services,repositories}
```

## 2. Utwórz manifest modułu

`packages/modules/your-module/src/manifest.ts`:

```typescript
import type { ModuleManifest } from '@webf/core';

export const manifest: ModuleManifest = {
  name: 'your-module',
  version: '1.0.0',
  description: 'Description of your module',
  permissions: [
    'your-module:read',
    'your-module:create',
    'your-module:update',
    'your-module:delete',
  ],
  navigation: [
    {
      label: 'Your Module',
      path: '/your-module',
      icon: 'icon-name',
      permissions: ['your-module:read'],
    },
  ],
  events: {
    published: ['your-module.created', 'your-module.updated'],
    subscribed: ['other-module.event'],
  },
};
```

## 3. Utwórz index.ts

`packages/modules/your-module/src/index.ts`:

```typescript
import { moduleRegistry } from '@webf/core';
import { manifest } from './manifest';

export function registerYourModule() {
  moduleRegistry.register(manifest);
}

export * from './services';
export * from './repositories';
```

## 4. Utwórz service i repository

- `src/services/your-service.ts` - logika biznesowa
- `src/repositories/your-repository.ts` - dostęp do danych

## 5. Utwórz routes

`src/routes.ts`:

```typescript
import type { FastifyInstance } from 'fastify';
import { YourService } from './services';
import { hasPermission, Errors } from '@webf/core';

export async function registerYourRoutes(app: FastifyInstance) {
  const service = new YourService();

  app.get('/api/your-module', async (request, reply) => {
    await request.requireAuth();
    if (!hasPermission(request.auth!, 'your-module:read')) {
      throw Errors.forbidden();
    }
    const data = await service.list(request.auth!);
    return reply.send({ data });
  });
}
```

## 6. Zarejestruj moduł w API

W `apps/api/src/modules.ts`:

```typescript
import { registerYourModule } from '../../packages/modules/your-module';
import { registerYourRoutes } from '../../packages/modules/your-module/src/routes';

export async function registerModules(app: FastifyInstance) {
  registerYourModule();
  await registerYourRoutes(app);
  // ... inne moduły
}
```

## 7. Dodaj migracje Prisma (jeśli potrzebne)

Dodaj modele do `apps/api/prisma/schema.prisma` i uruchom:

```bash
pnpm db:migrate
```

## 8. Dodaj uprawnienia do seed

W `apps/api/prisma/seed.ts` dodaj nowe uprawnienia do listy `permissions`.

## Checklist

- [ ] Struktura folderów utworzona
- [ ] Manifest zdefiniowany
- [ ] Service i repository zaimplementowane
- [ ] Routes zarejestrowane
- [ ] Moduł zarejestrowany w `apps/api/src/modules.ts`
- [ ] Migracje Prisma (jeśli potrzebne)
- [ ] Uprawnienia dodane do seed
- [ ] Testy (opcjonalnie)

## Zasady

1. **Nie importuj innych modułów bezpośrednio** - używaj shared contracts lub eventów
2. **Wszystkie endpointy wymagają autoryzacji** - użyj `request.requireAuth()`
3. **Sprawdzaj uprawnienia** - użyj `hasPermission()`
4. **Loguj audit** - użyj `createAuditLogger()`
5. **Publikuj eventy** - użyj `eventBus.publish()` dla ważnych działań
