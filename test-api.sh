#!/bin/bash

# Skrypt do testowania API WebF App
# Użycie: ./test-api.sh

API_URL="http://localhost:3001"

echo "🧪 Testowanie API WebF App"
echo "=========================="
echo ""

# 1. Health check
echo "1️⃣ Health check..."
curl -s "$API_URL/health" | jq .
echo ""
echo ""

# 2. Login
echo "2️⃣ Logowanie..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@webf.app","password":"admin123"}')

echo "$LOGIN_RESPONSE" | jq .

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Błąd logowania!"
  exit 1
fi

echo "✅ Zalogowano pomyślnie!"
echo "Token: ${TOKEN:0:50}..."
echo ""
echo ""

# 3. Pobierz klientów
echo "3️⃣ Pobieranie klientów..."
curl -s "$API_URL/api/clients" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""
echo ""

# 4. Pobierz projekty
echo "4️⃣ Pobieranie projektów..."
PROJECTS_RESPONSE=$(curl -s "$API_URL/api/projects" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROJECTS_RESPONSE" | jq .

PROJECT_ID=$(echo "$PROJECTS_RESPONSE" | jq -r '.data[0].id')

if [ "$PROJECT_ID" != "null" ] && [ -n "$PROJECT_ID" ]; then
  echo ""
  echo "5️⃣ Pobieranie szczegółów projektu (ID: $PROJECT_ID)..."
  curl -s "$API_URL/api/projects/$PROJECT_ID" \
    -H "Authorization: Bearer $TOKEN" | jq .
else
  echo "⚠️  Brak projektów w bazie"
fi

echo ""
echo ""
echo "✅ Testy zakończone!"
