export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">WebF App</h1>
        <p className="text-lg text-gray-600 mb-8">
          System Operacyjny Firmy IT - Zarządzanie projektami, zleceniami i czasem pracy
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <p className="text-gray-700">
            Aplikacja jest w trakcie budowy. Backend API działa na{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3001</code>
          </p>
          <p className="text-gray-700 mt-4">
            Frontend będzie dostępny na{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
          </p>
        </div>
      </div>
    </main>
  );
}
