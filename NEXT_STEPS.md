# Co dalej? - Przewodnik po następnych krokach

## ✅ Aplikacja działa!

Widzisz stronę statusu, co oznacza że:
- ✅ Frontend (Next.js) działa na http://localhost:3000
- ✅ Backend API działa na http://localhost:3001
- ✅ Baza danych jest skonfigurowana

## 🧪 Testowanie API

### 1. Sprawdź health check

```bash
curl http://localhost:3001/health
```

Powinieneś zobaczyć: `{"status":"ok","timestamp":"..."}`

### 2. Zaloguj się

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@webf.app","password":"admin123"}'
```

Otrzymasz token JWT w odpowiedzi. Zapisz go do zmiennej:

```bash
TOKEN="twoj-token-tutaj"
```

### 3. Pobierz listę projektów

```bash
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Pobierz szczegóły projektu

```bash
# Najpierw znajdź ID projektu z listy powyżej
PROJECT_ID="id-projektu"
curl http://localhost:3001/api/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Utwórz nowy projekt

```bash
# Najpierw pobierz ID klienta
curl http://localhost:3001/api/clients \
  -H "Authorization: Bearer $TOKEN"

# Utwórz projekt
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nowy Projekt",
    "clientId": "id-klienta",
    "type": "website",
    "description": "Opis projektu"
  }'
```

## 🎯 Następne kroki - co zbudować?

### 1. **Frontend UI - Priorytet #1** 🎨

Aktualnie masz tylko stronę statusu. Zbuduj pełny interfejs:

#### A) Strona logowania
- `apps/web/src/app/login/page.tsx`
- Formularz logowania
- Przekierowanie po zalogowaniu

#### B) Dashboard
- `apps/web/src/app/dashboard/page.tsx`
- "Moje zadania" (assigned_to = ja)
- "Projekty aktywne" z paskiem postępu
- "Blokery" (zadania blocked)
- "Czas dziś/ten tydzień"

#### C) Lista projektów
- `apps/web/src/app/projects/page.tsx`
- Tabela z filtrami (status, manager, klient)
- Link do szczegółów projektu

#### D) Widok projektu
- `apps/web/src/app/projects/[id]/page.tsx`
- Zakładki: Overview, Tasks, Time, Performance, Dates, Resources
- Kanban dla zadań
- Formularz logowania czasu

### 2. **Komponenty UI** 🧩

Zainstaluj shadcn/ui i stwórz komponenty:

```bash
cd apps/web
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card table input form
```

### 3. **API Client** 📡

Stwórz klienta API dla frontendu:

```typescript
// apps/web/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getProjects(token: string) {
  const res = await fetch(`${API_URL}/api/projects`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}
```

### 4. **State Management** 🔄

Użyj React Query dla cache'owania i synchronizacji:

```typescript
// apps/web/src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut
    },
  },
});
```

### 5. **Authentication Context** 🔐

Stwórz context dla zarządzania sesją:

```typescript
// apps/web/src/contexts/auth-context.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

## 🛠️ Przydatne narzędzia

### Prisma Studio - GUI dla bazy danych

```bash
pnpm db:studio
```

Otworzy się przeglądarka z interfejsem do przeglądania i edycji danych.

### Testowanie endpointów

Użyj **Postman** lub **Insomnia** do testowania API:
- Importuj kolekcję endpointów
- Testuj różne scenariusze
- Sprawdzaj odpowiedzi

## 📋 Checklist - Co zbudować w pierwszej kolejności?

- [ ] Strona logowania
- [ ] Dashboard z podstawowymi statystykami
- [ ] Lista projektów z filtrami
- [ ] Widok projektu (Overview)
- [ ] Lista zadań w projekcie
- [ ] Formularz tworzenia zadania
- [ ] Logowanie czasu pracy
- [ ] Lista klientów

## 🚀 Szybki start - Stwórz stronę logowania

1. **Utwórz plik:**
   ```bash
   mkdir -p apps/web/src/app/login
   touch apps/web/src/app/login/page.tsx
   ```

2. **Podstawowy kod:**
   ```typescript
   'use client';

   import { useState } from 'react';
   import { useRouter } from 'next/navigation';

   export default function LoginPage() {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const router = useRouter();

     async function handleSubmit(e: React.FormEvent) {
       e.preventDefault();
       const res = await fetch('http://localhost:3001/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password }),
       });
       const data = await res.json();
       if (data.data?.token) {
         localStorage.setItem('token', data.data.token);
         router.push('/dashboard');
       }
     }

     return (
       <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
         <h1 className="text-2xl font-bold mb-4">Logowanie</h1>
         <input
           type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Email"
           className="w-full p-2 border rounded mb-2"
         />
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="Hasło"
           className="w-full p-2 border rounded mb-4"
         />
         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
           Zaloguj się
         </button>
      </form>
     );
   }
   ```

3. **Przetestuj:**
   - Otwórz http://localhost:3000/login
   - Zaloguj się: admin@webf.app / admin123
   - Powinieneś zostać przekierowany do dashboardu

## 💡 Wskazówki

1. **Zacznij od małych kroków** - najpierw logowanie, potem dashboard
2. **Używaj TypeScript** - wszystkie typy są już zdefiniowane w `@webf/shared`
3. **Testuj API najpierw** - użyj curl/Postman przed budowaniem UI
4. **Sprawdzaj Prisma Studio** - zobacz jakie dane masz w bazie
5. **Czytaj dokumentację** - `ARCHITECTURE.md` i `docs/ADDING_MODULE.md`

## 🎉 Gotowe do startu!

Masz działającą aplikację z pełnym backendem. Teraz czas na frontend! 

Zacznij od strony logowania, a potem buduj kolejne ekrany jeden po drugim.
