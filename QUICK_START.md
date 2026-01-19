# Quick Start Guide

## Uruchomienie w 5 minut

### 1. Zainstaluj zależności

```bash
pnpm install
```

### 2. Uruchom bazę danych

```bash
docker-compose up -d
```

### 3. Skonfiguruj zmienne środowiskowe

```bash
cp .env.example .env
```

Edytuj `.env` jeśli potrzebujesz (opcjonalnie - aplikacja działa z domyślnymi wartościami).

### 4. Uruchom migracje i seed

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Uruchom aplikację

```bash
pnpm dev
```

### 6. Otwórz w przeglądarce

- Frontend: http://localhost:3000
- API: http://localhost:3001

### Domyślne konto

- **Email:** admin@webf.app
- **Hasło:** admin123

## Co dalej?

1. Zaloguj się do aplikacji
2. Utwórz nowy projekt
3. Dodaj zadania
4. Zaloguj czas pracy
5. Skonfiguruj integracje (opcjonalnie)

## Rozwiązywanie problemów

### Błąd połączenia z bazą danych

Upewnij się, że Docker Compose działa:
```bash
docker-compose ps
```

### Błąd migracji

Usuń bazę i zacznij od nowa:
```bash
docker-compose down -v
docker-compose up -d
pnpm db:migrate
pnpm db:seed
```

### Port zajęty

Zmień porty w `.env`:
- `API_PORT=3001`
- Frontend domyślnie używa portu 3000 (zmień w `apps/web/package.json`)
