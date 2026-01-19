# Frontend - WebF App

## 🎨 Co zostało zbudowane

### Struktura
- ✅ **API Client** (`src/lib/api.ts`) - wszystkie endpointy API
- ✅ **Authentication Context** (`src/contexts/auth-context.tsx`) - zarządzanie sesją
- ✅ **React Query Provider** - cache'owanie i synchronizacja danych
- ✅ **Layout z Sidebar** - nawigacja po aplikacji
- ✅ **Auth Guard** - ochrona routów

### Ekrany

#### 1. **Logowanie** (`/login`)
- Formularz logowania
- Automatyczne przekierowanie po zalogowaniu
- Obsługa błędów

#### 2. **Dashboard** (`/dashboard`)
- Statystyki: projekty aktywne, zadania zablokowane, czas dzisiaj
- Moje zadania (przypisane do użytkownika)
- Projekty aktywne z paskiem postępu

#### 3. **Lista projektów** (`/projects`)
- Grid z kartami projektów
- Filtry: status, wyszukiwanie
- Pasek postępu dla każdego projektu
- Link do szczegółów projektu

#### 4. **Widok projektu** (`/projects/[id]`)
- **Zakładka Overview**: informacje, status, terminy, URLs
- **Zakładka Tasks**: lista zadań, dodawanie, zmiana statusu
- **Zakładka Time**: logowanie czasu, historia logów
- **Zakładka Resources**: domeny, hosting, linki

#### 5. **Lista klientów** (`/clients`)
- Tabela z klientami
- Informacje: email, telefon, liczba projektów

#### 6. **Czas pracy** (`/time`)
- Lista wszystkich logów czasu użytkownika
- Suma czasu
- Szczegóły: projekt, zadanie, notatka

## 🚀 Uruchomienie

```bash
# Z root projektu
pnpm dev

# Lub osobno
cd apps/web
pnpm dev
```

Frontend będzie dostępny na: http://localhost:3000

## 🔐 Logowanie

Domyślne konto:
- **Email:** admin@webf.app
- **Hasło:** admin123

## 📁 Struktura plików

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── login/              # Strona logowania
│   ├── dashboard/          # Dashboard
│   ├── projects/          # Projekty
│   │   ├── page.tsx        # Lista projektów
│   │   └── [id]/           # Widok projektu
│   ├── clients/            # Klienci
│   └── time/               # Czas pracy
├── components/
│   ├── layout/             # Layout komponenty
│   │   ├── sidebar.tsx     # Sidebar z nawigacją
│   │   └── main-layout.tsx
│   ├── providers.tsx       # React Query + Auth providers
│   └── auth-guard.tsx      # Ochrona routów
├── contexts/
│   └── auth-context.tsx    # Context autoryzacji
└── lib/
    └── api.ts              # API client
```

## 🎨 Stylowanie

Używamy **Tailwind CSS**:
- Prosty, czytelny design
- Responsywny layout
- Spójne kolory i spacing

## 🔄 State Management

- **React Query** - cache'owanie danych z API
- **Context API** - stan autoryzacji
- **Local Storage** - przechowywanie tokenu

## 📝 Funkcjonalności

### ✅ Zaimplementowane
- Logowanie i wylogowanie
- Dashboard z statystykami
- Lista projektów z filtrami
- Widok projektu z zakładkami
- Zarządzanie zadaniami
- Logowanie czasu
- Lista klientów
- Lista czasu pracy

### 🚧 Do rozbudowy (opcjonalnie)
- Tworzenie nowego projektu (formularz)
- Edycja projektu
- Tworzenie nowego klienta
- Timer (start/stop) dla czasu pracy
- Filtry czasu pracy
- Eksport danych
- Notyfikacje

## 🐛 Rozwiązywanie problemów

### Błąd: "Cannot find module '@webf/shared'"
```bash
pnpm install
```

### Błąd: "API request failed"
- Sprawdź czy API działa: `curl http://localhost:3001/health`
- Sprawdź `NEXT_PUBLIC_API_URL` w `.env.local`

### Błąd: "Token expired"
- Wyloguj się i zaloguj ponownie
- Token jest przechowywany w localStorage

## 🎯 Następne kroki

1. **Dodaj formularz tworzenia projektu** - `/projects/new`
2. **Dodaj edycję projektu** - modal lub osobna strona
3. **Dodaj timer** - start/stop dla czasu pracy
4. **Dodaj notyfikacje** - toast messages
5. **Dodaj loading states** - skeleton loaders
6. **Dodaj error boundaries** - lepsze obsługiwanie błędów

## 💡 Wskazówki

- Wszystkie dane są cache'owane przez React Query
- Automatyczna refetch przy powrocie do okna
- Token jest automatycznie dodawany do requestów
- Chronione routy przekierowują do `/login` jeśli brak tokenu
