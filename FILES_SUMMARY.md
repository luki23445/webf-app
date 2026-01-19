# Podsumowanie Plików i Struktury

## Struktura Monorepo

```
webf-app/
├── apps/
│   ├── api/                    # Fastify backend
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── db.ts           # Prisma client
│   │   │   ├── modules.ts      # Module registration
│   │   │   ├── scheduler.ts    # Background jobs
│   │   │   ├── plugins/       # Fastify plugins
│   │   │   └── routes/        # Auth routes
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── seed.ts         # Seed data
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   └── app/            # Next.js App Router
│       └── package.json
├── packages/
│   ├── core/                   # Core framework
│   │   ├── src/
│   │   │   ├── module-registry.ts
│   │   │   ├── event-bus.ts
│   │   │   ├── auth.ts
│   │   │   ├── rbac.ts
│   │   │   ├── errors.ts
│   │   │   ├── logger.ts
│   │   │   ├── encryption.ts
│   │   │   ├── audit.ts
│   │   │   └── types.ts
│   │   └── package.json
│   ├── shared/                 # Shared types & schemas
│   │   ├── src/
│   │   │   ├── schemas.ts      # Zod schemas
│   │   │   └── types.ts        # TypeScript types
│   │   └── package.json
│   └── modules/                # Domain modules
│       ├── projects/
│       ├── tasks/
│       ├── time/
│       ├── clients/
│       ├── resources/
│       ├── pagespeed/
│       ├── calendar/
│       ├── integrations/
│       └── audit/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
├── ARCHITECTURE.md
├── QUICK_START.md
└── .env.example
```

## Kluczowe Pliki

### Konfiguracja
- `package.json` - Root package.json z workspace scripts
- `pnpm-workspace.yaml` - Workspace configuration
- `turbo.json` - Turborepo configuration
- `.env.example` - Environment variables template
- `docker-compose.yml` - PostgreSQL container

### Dokumentacja
- `README.md` - Main documentation
- `ARCHITECTURE.md` - Architecture decisions
- `QUICK_START.md` - Quick start guide
- `docs/ADDING_MODULE.md` - How to add a new module

### Backend (apps/api)
- `src/index.ts` - Fastify server entry point
- `src/db.ts` - Prisma client singleton
- `src/modules.ts` - Module registration
- `src/scheduler.ts` - Background jobs (PageSpeed, Outbox)
- `src/plugins/auth.ts` - Authentication middleware
- `src/plugins/error-handler.ts` - Error handling
- `src/routes/auth.ts` - Auth endpoints (login, register)
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Seed data

### Frontend (apps/web)
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Home page
- `src/app/globals.css` - Global styles
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind configuration

### Core (packages/core)
- `src/module-registry.ts` - Module registration system
- `src/event-bus.ts` - In-process event bus
- `src/auth.ts` - JWT authentication
- `src/rbac.ts` - Role-based access control
- `src/errors.ts` - Error handling
- `src/logger.ts` - Logging
- `src/encryption.ts` - Encryption utilities
- `src/audit.ts` - Audit logging
- `src/types.ts` - Core types

### Shared (packages/shared)
- `src/schemas.ts` - Zod validation schemas
- `src/types.ts` - Shared TypeScript types

### Moduły (packages/modules/*)
Każdy moduł ma:
- `src/manifest.ts` - Module manifest
- `src/index.ts` - Module registration
- `src/routes.ts` - API routes
- `src/services/` - Business logic
- `src/repositories/` - Data access (opcjonalnie)
- `package.json` - Module dependencies

## Komendy

### Development
```bash
pnpm dev              # Uruchom frontend + backend
```

### Database
```bash
pnpm db:migrate       # Uruchom migracje Prisma
pnpm db:seed          # Seed przykładowych danych
pnpm db:studio        # Otwórz Prisma Studio
```

### Build
```bash
pnpm build            # Build wszystkich aplikacji
pnpm lint             # Lint wszystkich aplikacji
pnpm type-check       # Sprawdź typy TypeScript
```

### Docker
```bash
docker-compose up -d   # Uruchom PostgreSQL
docker-compose down    # Zatrzymaj PostgreSQL
docker-compose down -v # Zatrzymaj i usuń dane
```

## Endpointy API

### Auth
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie

### Projects
- `GET /api/projects` - Lista projektów
- `GET /api/projects/:id` - Szczegóły projektu
- `POST /api/projects` - Utwórz projekt
- `PUT /api/projects/:id` - Aktualizuj projekt
- `DELETE /api/projects/:id` - Usuń projekt

### Tasks
- `POST /api/tasks` - Utwórz zadanie
- `PUT /api/tasks/:id` - Aktualizuj zadanie
- `POST /api/tasks/:id/checklist` - Dodaj checklist item
- `PATCH /api/tasks/checklist/:itemId` - Toggle checklist item

### Time
- `POST /api/time` - Zaloguj czas
- `GET /api/time` - Lista logów czasu

### Clients
- `GET /api/clients` - Lista klientów
- `POST /api/clients` - Utwórz klienta
- `PUT /api/clients/:id` - Aktualizuj klienta

### Resources
- `POST /api/projects/:projectId/resources/domains` - Dodaj domenę
- `POST /api/projects/:projectId/resources/hosting` - Dodaj hosting
- `POST /api/projects/:projectId/resources/dns` - Dodaj rekord DNS
- `POST /api/projects/:projectId/resources/links` - Dodaj link

### PageSpeed
- `POST /api/pagespeed/targets` - Utwórz target
- `POST /api/pagespeed/targets/:id/trigger` - Uruchom test

### Integrations
- `GET /api/integrations/:type` - Pobierz konfigurację
- `PUT /api/integrations/:type` - Zaktualizuj konfigurację
- `POST /api/integrations/n8n/actions/*` - n8n webhook endpoints

### Audit
- `GET /api/audit` - Lista logów audit

## Następne Kroki

1. **Frontend UI** - Zbuduj pełny interfejs użytkownika
2. **Testy** - Dodaj unit i integration tests
3. **CI/CD** - Skonfiguruj pipeline
4. **Produkcja** - Przygotuj deployment
