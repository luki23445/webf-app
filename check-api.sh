#!/bin/bash

# Skrypt do sprawdzania czy API działa

echo "🔍 Sprawdzanie API..."
echo ""

# 1. Sprawdź czy port jest otwarty
echo "1️⃣ Sprawdzanie portu 3001..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Port 3001 jest otwarty"
    PROCESS=$(lsof -Pi :3001 -sTCP:LISTEN | tail -1)
    echo "   Proces: $PROCESS"
else
    echo "❌ Port 3001 nie jest otwarty"
    echo "   API prawdopodobnie nie działa"
    echo ""
    echo "💡 Uruchom API:"
    echo "   cd apps/api && pnpm dev"
    exit 1
fi

echo ""

# 2. Sprawdź health endpoint
echo "2️⃣ Sprawdzanie /health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)

if echo "$HEALTH_RESPONSE" | grep -q "status"; then
    echo "✅ API odpowiada poprawnie"
    echo "$HEALTH_RESPONSE" | jq . 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo "❌ API nie odpowiada poprawnie"
    echo "Odpowiedź: $HEALTH_RESPONSE"
    echo ""
    echo "💡 Sprawdź logi API w terminalu gdzie uruchomiłeś 'pnpm dev'"
    exit 1
fi

echo ""

# 3. Sprawdź czy to nie Next.js
echo "3️⃣ Sprawdzanie czy to nie Next.js..."
if echo "$HEALTH_RESPONSE" | grep -q "DOCTYPE html"; then
    echo "❌ To jest Next.js, nie API!"
    echo "   API nie działa na porcie 3001"
    echo ""
    echo "💡 Rozwiązanie:"
    echo "   1. Zatrzymaj wszystkie procesy (Ctrl+C)"
    echo "   2. Uruchom API osobno: cd apps/api && pnpm dev"
    echo "   3. W innym terminalu: cd apps/web && pnpm dev"
    exit 1
else
    echo "✅ To jest API (JSON response)"
fi

echo ""
echo "✅ API działa poprawnie!"
