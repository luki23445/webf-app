'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Krytyczny błąd</h1>
            <p className="text-gray-600 mb-6">
              {error.message || 'Wystąpił krytyczny błąd aplikacji'}
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Spróbuj ponownie
            </button>
            {error.digest && (
              <p className="text-xs text-gray-400 mt-4">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
