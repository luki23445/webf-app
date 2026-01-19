'use client';

export function handleApiError(error: any): string {
  if (error.message) {
    // Sprawdź typy błędów
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      return 'Nie można połączyć się z serwerem. Sprawdź czy API działa na porcie 3001.';
    }
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return 'Nieprawidłowy email lub hasło.';
    }
    
    if (error.message.includes('Network')) {
      return 'Problem z połączeniem sieciowym. Sprawdź połączenie internetowe.';
    }
    
    return error.message;
  }
  
  return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
}
