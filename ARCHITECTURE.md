# Decyzje Architektoniczne

## Stack Technologiczny

### Frontend: Next.js 14+ (App Router) + TypeScript + Tailwind + shadcn/ui
**Uzasadnienie:**
- Next.js App Router zapewnia RSC (React Server Components) dla lepszej wydajności
- shadcn/ui daje gotowe, dostępne komponenty bez zależności runtime
- Tailwind dla szybkiego stylowania
- TypeScript dla bezpieczeństwa typów

### Backend: Fastify + TypeScript
**Uzasadnienie:**
- Fastify jest szybszy niż Express, ma lepsze wsparcie dla TypeScript
- Prostszy niż NestJS dla MVP, ale wystarczająco rozszerzalny
- Wsparcie dla pluginów (idealne dla modułowej architektury)
- Lepsze wsparcie dla async/await

### Database: PostgreSQL + Prisma ORM
**Uzasadnienie:**
- PostgreSQL dla relacyjnych danych i JSONB (dla elastycznych konfiguracji)
- Prisma dla type-safe queries i migracji
- Wspólna baza dla wszystkich modułów (prostota > mikroserwisy)

### Monorepo: pnpm + Turborepo
**Uzasadnienie:**
- pnpm dla efektywnego zarządzania zależnościami
- Turborepo dla cache'owania buildów i równoległego wykonywania
- Wspólne typy między frontend/backend przez packages/shared

## Architektura Modułowa

### Core Framework (packages/core)
**Zasada:** Core nie zna domeny biznesowej. Zapewnia tylko infrastrukturę.

**Składniki:**
1. **Module Registry** - dynamiczne ładowanie modułów przez manifest
2. **Event Bus** - in-process pub/sub dla komunikacji między modułami
3. **Outbox Pattern** - transactional outbox dla integracji zewnętrznych (n8n)
4. **Auth + RBAC** - JWT + role-based access control
5. **Error Handling** - standardyzowane błędy z kodami
6. **Audit Log** - logowanie wszystkich zmian
7. **DB Client** - wrapper na Prisma z multi-tenancy
8. **Logger** - strukturalne logowanie

### Moduły (packages/modules/*)
**Zasada:** Moduły są niezależne, komunikują się przez:
- **Shared Contracts** (DTO w packages/shared)
- **Public API** modułu (endpointy)
- **Events** (publish/subscribe)

**Każdy moduł ma:**
- `manifest.ts` - metadane modułu (nazwa, wersja, permissions, routes, UI navigation)
- `routes.ts` - rejestracja endpointów
- `services/` - logika biznesowa
- `repositories/` - dostęp do danych
- `events.ts` - eventy publikowane/subskrybowane
- `ui/` - komponenty React (opcjonalnie)

### Komunikacja Między Modułami

**Zakazane:**
- Bezpośrednie importy między modułami
- Wzajemne zależności

**Dozwolone:**
1. **Shared Contracts** - typy/DTO w `packages/shared`
2. **Event Bus** - moduł A publikuje event, moduł B subskrybuje
3. **Public API** - moduł A wywołuje endpoint modułu B (HTTP wewnętrzny)

### Multi-Tenancy
- Wszystkie tabele mają `organization_id` (nawet jeśli jedna firma)
- Middleware automatycznie filtruje po `org_id` z tokenu JWT
- Na przyszłość: łatwe rozszerzenie na multi-tenant

## Integracje

### Google PageSpeed Insights
- **API Key** w IntegrationConfig (zaszyfrowane)
- **Scheduler** (cron) uruchamiany 1x dziennie
- **Retry** z exponential backoff
- **Mock** w dev (jeśli brak API key)

### Google Calendar
- **OAuth2** dla użytkowników (lepsze niż Service Account dla wielu użytkowników)
- **Sync** co X minut (konfigurowalne w UI)
- **Tagowanie** eventów przez extendedProperties (projectId)
- **Bidirectional** - push i pull

### n8n
- **Transactional Outbox** - eventy zapisywane w DB, worker wysyła do webhook
- **HMAC** podpis dla bezpieczeństwa
- **Idempotency** przez idempotency key
- **Retry** z exponential backoff

## Bezpieczeństwo

### Sekrety
- **Encryption** przez libsodium lub node crypto
- **KMS Key** z env (ENCRYPTION_KEY)
- **Nigdy** w logach

### Walidacja
- **Zod** na granicy API (wszystkie endpointy)
- **Prisma** walidacja na poziomie DB

### Audit Log
- **Wszystkie** zmiany (create/update/delete)
- **Kto, co, kiedy, metadata**

## Rozszerzalność

### Dodawanie Nowego Modułu
1. Utwórz `packages/modules/new-module/`
2. Dodaj `manifest.ts` z metadanymi
3. Zarejestruj w `apps/api/src/modules.ts`
4. Dodaj migracje Prisma
5. Dodaj UI navigation (jeśli potrzebne)

**Core nie wymaga zmian!**

## Performance

- **Brak overengineeringu** - prostota > mikroserwisy
- **Jeden backend, jeden frontend**
- **Event bus in-process** (wystarczy dla MVP)
- **Outbox pattern** dla integracji zewnętrznych (async)

## Developer Experience

- **Jedna komenda startowa:** `pnpm dev`
- **Docker Compose** dla Postgres
- **Seed** z przykładowymi danymi
- **Aplikacja działa bez konfiguracji** (mocki dla integracji)
