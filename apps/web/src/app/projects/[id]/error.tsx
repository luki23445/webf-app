'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Project page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Błąd ładowania projektu</h1>
        <p className="text-gray-600 mb-6">
          {error.message || 'Nie udało się załadować projektu'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Spróbuj ponownie
          </button>
          <Link
            href="/projects"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Wróć do listy projektów
          </Link>
        </div>
      </div>
    </div>
  );
}
