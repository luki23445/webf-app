# WebF App - System Operacyjny Firmy IT

Aplikacja do zarządzania projektami, zleceniami, czasem pracy oraz integracjami dla firmy IT.

## 🚀 Szybki Start

### Wymagania
- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose

### Uruchomienie (5 minut)

1. **Sklonuj i zainstaluj zależności:**
   ```bash
   pnpm install
   ```

2. **Uruchom bazę danych:**
   ```bash
   docker-compose up -d
   ```

3. **Skonfiguruj zmienne środowiskowe:**
   ```bash
   cp .env.example .env
   # Edytuj .env jeśli potrzebujesz (opcjonalnie - aplikacja działa z domyślnymi wartościami)
   ```

4. **Uruchom migracje i seed:**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Uruchom aplikację:**
   ```bash
   pnpm dev
   ```

6. **Otwórz w przeglądarce:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

### Domyślne konto
Po seedzie:
- **Email:** admin@webf.app
- **Hasło:** admin123

## 📁 Struktura Projektu

```
webf-app/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── core/         # Core framework (auth, RBAC, event bus, registry)
│   ├── shared/       # Shared types, DTO, schemas
│   └── modules/      # Moduły domenowe
│       ├── projects/
│       ├── tasks/
│       ├── time/
│       ├── pagespeed/
│       ├── calendar/
│       ├── integrations/
│       ├── clients/
│       ├── resources/
│       └── audit/
└── docker-compose.yml
```

## 🔧 Konfiguracja

### Integracje (opcjonalne)

Aplikacja działa **bez konfiguracji integracji**. Moduły będą oznaczone jako "Not configured" w UI.

#### Google PageSpeed Insights
1. Utwórz projekt w [Google Cloud Console](https://console.cloud.google.com/)
2. Włącz API: PageSpeed Insights API
3. Utwórz klucz API
4. Dodaj do `.env`: `PAGESPEED_API_KEY=your-key`

#### Google Calendar
1. Utwórz OAuth2 credentials w Google Cloud Console
2. Dodaj do `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
   ```

#### n8n
1. Utwórz webhook w n8n workflow
2. Dodaj do `.env`:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxx
   N8N_WEBHOOK_SECRET=your-secret
   ```

## 📚 Dokumentacja

- [Architektura](./ARCHITECTURE.md) - decyzje architektoniczne
- [Dodawanie Modułu](./docs/ADDING_MODULE.md) - jak dodać nowy moduł

## 🛠️ Komendy

```bash
# Development
pnpm dev              # Uruchom frontend + backend

# Database
pnpm db:migrate       # Uruchom migracje
pnpm db:seed          # Seed przykładowych danych
pnpm db:studio        # Otwórz Prisma Studio

# Build
pnpm build            # Build wszystkich aplikacji
pnpm lint             # Lint wszystkich aplikacji
pnpm type-check       # Sprawdź typy TypeScript
```

## 🏗️ Architektura

Aplikacja jest zbudowana w architekturze modułowej:
- **Core** - infrastruktura (auth, RBAC, event bus, registry)
- **Moduły** - niezależne moduły domenowe
- **Shared** - wspólne typy i kontrakty

Moduły komunikują się przez:
- Shared contracts (DTO)
- Event bus (pub/sub)
- Public API

Zobacz [ARCHITECTURE.md](./ARCHITECTURE.md) dla szczegółów.

## 🔒 Bezpieczeństwo

- Wszystkie sekrety (API keys, tokens) są szyfrowane w bazie
- Audit log wszystkich zmian
- RBAC dla uprawnień
- Walidacja na granicy API (Zod)

## 📝 Licencja

Wewnętrzne oprogramowanie firmy.
