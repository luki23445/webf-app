# Rozwiązywanie problemów

## Problem: API nie odpowiada (dostajesz HTML z Next.js zamiast JSON)

### Diagnostyka

#### 1. Sprawdź czy API się uruchomiło

Uruchom API osobno, żeby zobaczyć logi:

```bash
cd apps/api
pnpm dev
```

Powinieneś zobaczyć:
```
API server started { port: 3001 }
```

Jeśli widzisz błędy, napraw je przed kontynuowaniem.

#### 2. Sprawdź czy port 3001 jest wolny

```bash
# macOS/Linux
lsof -i :3001

# Windows
netstat -ano | findstr :3001
```

Jeśli port jest zajęty, zmień `API_PORT` w `.env`.

#### 3. Sprawdź zmienne środowiskowe

Upewnij się, że masz plik `.env`:

```bash
cat .env | grep API_PORT
```

Powinno być: `API_PORT=3001`

#### 4. Sprawdź czy baza danych działa

```bash
docker-compose ps
```

Powinieneś zobaczyć `webf_postgres` jako `Up`.

#### 5. Sprawdź czy migracje są uruchomione

```bash
pnpm db:migrate
```

### Rozwiązania

#### Rozwiązanie 1: Uruchom API osobno

W jednym terminalu:
```bash
cd apps/api
pnpm dev
```

W drugim terminalu:
```bash
cd apps/web
pnpm dev
```

Teraz sprawdź:
```bash
curl http://localhost:3001/health
```

#### Rozwiązanie 2: Sprawdź błędy kompilacji

API może nie uruchomić się z powodu błędów TypeScript. Sprawdź:

```bash
cd apps/api
pnpm type-check
```

Napraw wszystkie błędy.

#### Rozwiązanie 3: Sprawdź zależności

Upewnij się, że wszystkie zależności są zainstalowane:

```bash
pnpm install
```

#### Rozwiązanie 4: Sprawdź Prisma Client

Prisma Client musi być wygenerowany:

```bash
cd apps/api
npx prisma generate
```

### Najczęstsze błędy

#### Błąd: "Cannot find module '@webf/core'"

**Rozwiązanie:**
```bash
pnpm install
cd apps/api
pnpm build
```

#### Błąd: "Prisma Client not generated"

**Rozwiązanie:**
```bash
cd apps/api
npx prisma generate
```

#### Błąd: "Port 3001 already in use"

**Rozwiązanie:**
1. Znajdź proces: `lsof -i :3001`
2. Zabij proces: `kill -9 <PID>`
3. Lub zmień port w `.env`: `API_PORT=3002`

#### Błąd: "Database connection failed"

**Rozwiązanie:**
1. Sprawdź czy Docker działa: `docker-compose ps`
2. Uruchom bazę: `docker-compose up -d`
3. Sprawdź `DATABASE_URL` w `.env`

### Testowanie po naprawie

1. **Health check:**
   ```bash
   curl http://localhost:3001/health
   ```
   Powinno zwrócić: `{"status":"ok","timestamp":"..."}`

2. **Login:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@webf.app","password":"admin123"}'
   ```

3. **Lista projektów (po zalogowaniu):**
   ```bash
   curl http://localhost:3001/api/projects \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Jeśli nadal nie działa

1. Sprawdź logi w terminalu gdzie uruchomiłeś `pnpm dev`
2. Sprawdź czy wszystkie moduły są zbudowane:
   ```bash
   pnpm build
   ```
3. Sprawdź czy nie ma błędów w `apps/api/src/modules.ts`
